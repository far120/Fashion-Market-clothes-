import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import Error from "../components/ui/Erorr";
import { useAuth } from "../features/auth/hooks/useAuth";
import { createOrder, getOrders, getProducts, updateOrder } from "../features/restaurant/services/restaurantApi";
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
      const params = { page, limit: 1, order: "desc" };
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
        return "border-[#fde68a] bg-[#fffbeb] text-[#b45309]";
      case "delivered":
        return "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]";
      case "cancelled":
        return "border-[#fecaca] bg-[#fff1f2] text-[#be123c]";
      default:
        return "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]";
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
      const productName = product && typeof product === "object" ? product.name : product || "Product";
      const unitPrice = Number(item?.price || product?.price || 0);

      return (
        <div
          key={`${order._id}-${index}`}
          className="flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3"
        >
          <div>
            <p className="font-semibold text-[#111827]">{productName}</p>
            <p className="text-xs text-[#6b7280]">
              Qty {item.quantity} · ${unitPrice.toFixed(2)} each
            </p>
          </div>
          <p className="text-sm font-bold text-[#111827]">${(unitPrice * item.quantity).toFixed(2)}</p>
        </div>
      );
    });
  }

  async function handlePlaceOrder() {
    if (!isAuthenticated) {
      toast?.warning("Please login first");
      return;
    }

    if (cart.length === 0) {
      toast?.info("Cart is empty");
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
      toast?.success("Order placed successfully");
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
      <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-[#fecaca] bg-[#fff7f7] p-8 text-center shadow-[0_18px_40px_rgba(127,29,29,0.08)]">
        <h1 className="text-3xl font-black text-[#7f1d1d]">Login Required</h1>
        <p className="mt-3 text-[#b91c1c]">Sign in to place and manage your orders.</p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-[#dc2626] px-5 py-3 font-semibold text-white transition hover:brightness-110"
        >
          Go To Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff1f2_0%,#f8fafc_38%,#ecfeff_100%)] px-4 py-10 sm:px-6 sm:py-16">
      <section className="mx-auto max-w-7xl rounded-4xl border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-700">
              Order Center
            </span>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Build orders in checkout, then review them in history.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              The checkout panel stays focused on placing a new order while the history panel keeps previous orders,
              users, and products easy to inspect.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-105">
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Cart items</p>
              <p className="mt-2 text-3xl font-black text-rose-950">{totals.itemsCount}</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Orders tracked</p>
              <p className="mt-2 text-3xl font-black text-sky-950">{orders.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Lines reviewed</p>
              <p className="mt-2 text-3xl font-black text-emerald-950">{orderItemCount}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">Cart total</p>
              <p className="mt-2 text-3xl font-black text-violet-950">${totals.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
          <article id="checkout" className="rounded-3xl border border-rose-100 bg-linear-to-br from-rose-50 via-white to-white p-5 shadow-[0_16px_40px_rgba(190,24,93,0.10)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-600">Checkout</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Create order</h2>
              </div>
              <div className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700">
                Total ${totals.totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="rounded-2xl border border-rose-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">${Number(item.price).toFixed(2)} each</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCart(removeCartItem(item.productId))}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        setCart(updateCartItem(item.productId, Number(event.target.value || 1)))
                      }
                      className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white"
                    />
                    <span className="text-sm font-medium text-slate-500">
                      Line total ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <p className="rounded-2xl border border-dashed border-rose-200 bg-white p-5 text-sm text-slate-500">
                  Cart is empty. Add products from the menu to start a new order.
                </p>
              )}
            </div>

            <div className="mt-6 rounded-3xl border border-rose-100 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">Summary</p>
                  <p className="mt-1 text-sm text-slate-500">Review before you submit the order.</p>
                </div>
                <p className="text-3xl font-black text-slate-950">${totals.totalAmount.toFixed(2)}</p>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting || cart.length === 0}
                className="mt-5 w-full rounded-2xl bg-[linear-gradient(90deg,#e11d48_0%,#fb7185_100%)] px-4 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(225,29,72,0.25)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Place Order"}
              </button>
            </div>
          </article>

          <article id="history" className="rounded-3xl border border-sky-100 bg-linear-to-br from-sky-50 via-white to-white p-5 shadow-[0_16px_40px_rgba(37,99,235,0.10)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">History</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Your orders</h2>
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-2xl border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-sky-900 outline-none"
              >
                <option value="all">All statuses</option>
                {statusList.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              This area is intentionally separate from checkout so order review stays focused, readable, and easy to
              scan.
            </p>

            {loading ? (
              <div className="mt-8 flex items-center justify-center py-10">
                <Spinner />
              </div>
            ) : error ? (
              <div className="mt-6">
                <Error message={error.message} />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {orders.map((order) => (
                  <article key={order._id} className="rounded-3xl border border-sky-100 bg-white p-4 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
                          Order #{order._id?.slice(-6)}
                        </p>
                        <h3 className="mt-1 text-lg font-black text-slate-950">{renderOrderUser(order)}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                          <span className="rounded-full bg-slate-50 px-3 py-1">
                            {order.user && typeof order.user === "object" ? order.user.email : "Customer details loaded"}
                          </span>
                          <span className="rounded-full bg-slate-50 px-3 py-1">
                            {(order.items || []).length} products
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${getStatusStyles(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recent order"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">{renderOrderItems(order)}</div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total</p>
                        <p className="text-2xl font-black text-slate-950">${Number(order.totalAmount || 0).toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAdmin ? (
                          <select
                            value={order.status}
                            onChange={(event) => handleOrderUpdate(order._id, event.target.value)}
                            className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-900 outline-none"
                          >
                            {statusList.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          order.status === "pending" && (
                            <button
                              type="button"
                              onClick={() => handleOrderUpdate(order._id, "cancelled")}
                              className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-700 transition hover:bg-rose-50"
                            >
                              Cancel order
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </article>
                ))}

                {orders.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-sky-200 bg-white p-5 text-sm text-slate-500">
                    No orders yet. Place the first one from the checkout panel.
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-3">
                  <button
                    type="button"
                    disabled={currentPage <= 1 || loading}
                    onClick={() => loadOrders(currentPage - 1, statusFilter)}
                    className="rounded-xl border border-sky-200 px-3 py-2 text-xs font-semibold text-sky-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                    Page {currentPage} / {totalPages}
                  </p>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => loadOrders(currentPage + 1, statusFilter)}
                    className="rounded-xl border border-sky-200 px-3 py-2 text-xs font-semibold text-sky-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
