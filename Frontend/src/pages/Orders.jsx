import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiPackage, FiTrash2, FiClock, FiCheckCircle, FiXCircle, FiFilter, FiArrowRight } from "react-icons/fi";
import Spinner from "../components/ui/Spinner";
import Error from "../components/ui/Erorr";
import { useAuth } from "../features/auth/hooks/useAuth";
import { createOrder, getOrders, getProducts, updateOrder } from "../features/product/services/productApi";
import { clearCart, getCartTotals, readCart, removeCartItem, syncCartWithInventory, updateCartItem } from "../utils/cart";
import { useToast } from "../context/ToastContext";

const statusList = ["pending", "processing", "delivered", "cancelled"];

export default function OrdersPage() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadOrders(page = currentPage, status = statusFilter) {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = { page, limit: 10, order: "desc" };
      if (status !== "all") {
        params.status = status;
      }

      const data = await getOrders(params);
      const ownOrders = (data.result || []).filter((order) => {
        const orderUserId = order?.user && typeof order.user === "object" ? order.user?._id : order?.user;
        return !user?._id || String(orderUserId) === String(user._id);
      });

      setOrders(ownOrders);
      setCurrentPage(data.page || page);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function syncInventory() {
      try {
        const data = await getProducts({ page: 1, limit: 100, order: "desc" });
        if (!mounted) {
          return;
        }

        setInventory(data.result || []);
        setCart(syncCartWithInventory(readCart(), data.result || []));
      } catch {
        if (mounted) {
          setCart(readCart());
        }
      }
    }

    syncInventory();
    loadOrders(1, statusFilter);

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders(1, statusFilter);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (inventory.length > 0) {
      setCart((currentCart) => syncCartWithInventory(currentCart, inventory));
    }
  }, [inventory]);

  const totals = useMemo(() => getCartTotals(cart), [cart]);

  const orderItemCount = useMemo(() => {
    return orders.reduce((count, order) => {
      return count + (order.items || []).length;
    }, 0);
  }, [orders]);

  function getStatusStyles(status) {
    switch (status) {
      case "processing":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300";
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-300";
      default:
        return "bg-sky-500/10 text-sky-600 border-sky-500/30 dark:bg-sky-950/40 dark:text-sky-300";
    }
  }

  function renderOrderUser(order) {
    const orderUser = order?.user;

    if (orderUser && typeof orderUser === "object") {
      return orderUser.username || orderUser.email || "Customer";
    }

    if (typeof orderUser === "string" && orderUser.length > 0) {
      return `Customer #${orderUser.slice(-6)}`;
    }

    return "Customer";
  }

  function renderOrderItems(order) {
    return (order.items || []).map((item, index) => {
      const product = item?.product;
      const productName = product && typeof product === "object" ? product.name : product || "Apparel Item";
      const unitPrice = Number(item?.price || product?.price || 0);

      return (
        <div
          key={`${order._id}-${index}`}
          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
        >
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white font-serif">{productName}</p>
            <p className="text-[11px] text-slate-500">
              Qty {item.quantity} × ${unitPrice.toFixed(2)}
            </p>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-amber-400 font-serif">${(unitPrice * item.quantity).toFixed(2)}</p>
        </div>
      );
    });
  }

  async function handlePlaceOrder() {
    if (!isAuthenticated) {
      toast?.warning("Please login to complete your order");
      return;
    }

    if (cart.length === 0) {
      toast?.info("Your shopping bag is empty");
      return;
    }

    try {
      setSubmitting(true);
      const syncedCart = syncCartWithInventory(cart, inventory);
      if (syncedCart.length === 0) {
        toast?.warning("Your cart has no available items");
        return;
      }

      await createOrder({
        items: syncedCart.map((item) => ({ product: item.productId, quantity: item.quantity })),
      });

      clearCart();
      setCart([]);
      toast?.success("Your order has been placed successfully!");
      await loadOrders(currentPage, statusFilter);
    } catch (err) {
      setError(err);
      toast?.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOrderUpdate(orderId, status) {
    try {
      setSubmitting(true);
      await updateOrder(orderId, isAdmin ? { status } : {});
      toast?.success(isAdmin ? "Order status updated" : "Order cancelled");
      await loadOrders(currentPage, statusFilter);
    } catch (err) {
      toast?.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto my-20 max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center text-3xl">
          <FiShoppingBag />
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Authentication Required</h1>
        <p className="text-sm text-slate-500">Sign in to review your shopping bag and track your orders.</p>
        <Link
          to="/login"
          className="inline-block px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 font-bold text-sm transition-all"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-10 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Summary Bar */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-500/30">
              ATELIER ORDER CENTER
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal">
              Shopping Bag & Order History
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-light">
              Review items in your shopping bag, place new couture orders, and track active deliveries.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bag Items</div>
              <div className="text-2xl font-serif font-bold text-amber-400">{totals.itemsCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Past Orders</div>
              <div className="text-2xl font-serif font-bold text-amber-400">{orders.length}</div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bag Total</div>
              <div className="text-2xl font-serif font-bold text-amber-400">${totals.totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Shopping Cart / Checkout (5 cols) */}
          <article className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  YOUR SELECTIONS
                </span>
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Shopping Bag</h2>
              </div>
              <span className="text-sm font-bold font-serif text-slate-900 dark:text-amber-400">
                ${totals.totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Bag Item List */}
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-serif font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500">${Number(item.price).toFixed(2)} each</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCart(removeCartItem(item.productId))}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                      title="Remove item"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-semibold uppercase">Qty:</span>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          setCart(updateCartItem(item.productId, Number(event.target.value || 1)))
                        }
                        className="w-16 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-center outline-none focus:border-amber-500"
                      />
                    </div>

                    <span className="font-serif font-bold text-slate-900 dark:text-amber-400">
                      Line Total: ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-10 text-center space-y-3 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6">
                  <FiShoppingBag className="text-3xl text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">Your shopping bag is currently empty.</p>
                  <Link
                    to="/menu"
                    className="inline-block px-5 py-2 rounded-full bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 text-xs font-bold uppercase tracking-wider"
                  >
                    Browse Catalog
                  </Link>
                </div>
              )}
            </div>

            {/* Total Summary Box & Submit */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totals.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Express Worldwide Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-slate-900 dark:text-white font-bold font-serif text-base pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Order Total</span>
                  <span className="text-amber-600 dark:text-amber-400">${totals.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting || cart.length === 0}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <span>Place Atelier Order</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          </article>

          {/* Right Column: Order History & Tracking (7 cols) */}
          <article className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  TIMELINE & LOGISTICS
                </span>
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Order History</h2>
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="all">All Statuses</option>
                {statusList.map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex py-16 items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <Error message={error.message} />
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="p-5 rounded-3xl bg-stone-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4 transition-all hover:border-amber-500/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-serif font-bold text-slate-900 dark:text-white">
                          Order ID #{order._id?.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Placed by {renderOrderUser(order)} • {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recently"}
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Order items */}
                    <div className="space-y-2">{renderOrderItems(order)}</div>

                    {/* Order footer summary & cancel action */}
                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block">Total Amount</span>
                        <span className="text-lg font-serif font-bold text-slate-900 dark:text-amber-400">
                          ${Number(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>

                      {isAdmin ? (
                        <select
                          value={order.status}
                          onChange={(event) => handleOrderUpdate(order._id, event.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white"
                        >
                          {statusList.map((s) => (
                            <option key={s} value={s}>
                              Set: {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        order.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleOrderUpdate(order._id, "cancelled")}
                            className="px-4 py-1.5 rounded-full border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            Cancel Order
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="py-16 text-center space-y-3 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-6">
                    <FiPackage className="text-3xl text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-500">No past order history found.</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      type="button"
                      disabled={currentPage <= 1 || loading}
                      onClick={() => loadOrders(currentPage - 1, statusFilter)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="font-semibold text-slate-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages || loading}
                      onClick={() => loadOrders(currentPage + 1, statusFilter)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </article>

        </div>

      </div>
    </div>
  );
}

