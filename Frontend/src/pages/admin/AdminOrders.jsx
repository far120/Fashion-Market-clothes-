import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import Error from "../../components/ui/Erorr";
import { useToast } from "../../context/ToastContext";
import { getOrders, updateOrder } from "../../features/product/services/productApi";

const statusList = ["pending", "processing", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalprice , setTotalPrice] = useState(0);

  async function refreshOrders(page = currentPage, status = statusFilter) {
    try {
      setLoading(true);
      const params = { page, limit: 2, order: "desc" };
      if (status !== "all") {
        params.status = status;
      }

      const data = await getOrders(params);
      setOrders(data.result || []);
      setCurrentPage(data.page || page);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshOrders(1, statusFilter);
  }, []);

  useEffect(() => {
    refreshOrders(1, statusFilter);
  }, [statusFilter]);


  async function handleStatusChange(orderId, status) {
    try {
      await updateOrder(orderId, { status });
      toast?.success("Order status updated");
      await refreshOrders(currentPage, statusFilter);
    } catch (err) {
      toast?.error(err.message);
    }
  }

  function getStatusStyles(status) {
    switch (status) {
      case "processing":
        return "border-sky-500/40 bg-sky-500/10 text-sky-300";
      case "delivered":
        return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
      case "cancelled":
        return "border-rose-500/40 bg-rose-500/10 text-rose-300";
      default:
        return "border-amber-500/40 bg-amber-500/10 text-amber-300";
    }
  }

  function getOrderCustomer(order) {
    const customer = order?.user;

    if (customer && typeof customer === "object") {
      return {
        name: customer.username || customer.email || "Client",
        email: customer.email || "No email",
      };
    }

    if (typeof customer === "string" && customer.length > 0) {
      return {
        name: `Client #${customer.slice(-6)}`,
        email: "User details not populated",
      };
    }

    return {
      name: "Client",
      email: "User details not available",
    };
  }

  function renderItems(order) {
    return (order.items || []).map((item, index) => {
      const product = item?.product;
      const productName = product && typeof product === "object" ? product.name : product || "Apparel Item";
      const unitPrice = Number(item?.price || product?.price || 0);

      return (
        <div key={`${order._id}-${index}`} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-serif text-sm font-medium text-white">{productName}</p>
              <p className="text-xs text-slate-400">
                Qty {item.quantity} · ${unitPrice.toFixed(2)} each
              </p>
            </div>
            <p className="font-serif text-sm font-medium text-[#D4AF37]">${(unitPrice * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      );
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-8 max-w-6xl px-4">
        <Error message={error.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] px-4 py-10 text-[#FAF9F6] sm:px-6 sm:py-16">
      <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Atelier Logistics
            </span>
            <h1 className="mt-3 font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
              Order Fulfillment & Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Manage client transactions, track purchased items, and update delivery status across all orders.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white outline-none focus:border-[#D4AF37]"
          >
            <option value="all" className="bg-[#090D16]">All Statuses</option>
            {statusList.map((status) => (
              <option key={status} value={status} className="bg-[#090D16]">
                {status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0D1322] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Orders Displayed</p>
            <p className="mt-1 font-serif text-3xl font-normal text-white">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0D1322] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Items</p>
            <p className="mt-1 font-serif text-3xl font-normal text-white">
              {orders.reduce((count, order) => count + (order.items || []).length, 0)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0D1322] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Batch Total Value</p>
            <p className="mt-1 font-serif text-3xl font-normal text-[#D4AF37]">
              ${orders.reduce((total, order) => total + Number(order.totalAmount || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {orders.map((order) => {
            const customer = getOrderCustomer(order);

            return (
              <article
                key={order._id}
                className="rounded-2xl border border-white/10 bg-[#0D1322] p-6 shadow-xl transition-all duration-300 hover:border-white/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                      Order #{order._id?.slice(-6)}
                    </span>
                    <h2 className="mt-1 font-serif text-lg font-medium text-white">{customer.name}</h2>
                    <p className="text-xs text-slate-400">{customer.email}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${getStatusStyles(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recent order"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">{renderItems(order)}</div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Order Total</p>
                    <p className="font-serif text-2xl font-normal text-[#D4AF37]">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={order.status}
                      onChange={(event) => handleStatusChange(order._id, event.target.value)}
                      className="rounded-xl border border-[#D4AF37]/40 bg-[#090D16] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] outline-none"
                    >
                      {statusList.map((status) => (
                        <option key={status} value={status} className="bg-[#090D16]">
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            );
          })}

          {orders.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
              <p className="text-sm text-slate-400">No orders found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0D1322] px-5 py-4">
          <button
            type="button"
            disabled={currentPage <= 1 || loading}
            onClick={() => refreshOrders(currentPage - 1, statusFilter)}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Page <span className="text-[#D4AF37] font-bold">{currentPage}</span> of{" "}
            <span className="text-white">{totalPages}</span>
          </p>
          <button
            type="button"
            disabled={currentPage >= totalPages || loading}
            onClick={() => refreshOrders(currentPage + 1, statusFilter)}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </section>
    </div>
  );
}
