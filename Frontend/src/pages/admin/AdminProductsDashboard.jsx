import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiBox, FiClock, FiLayers, FiShoppingBag } from "react-icons/fi";
import Spinner from "../../components/ui/Spinner";
import Error from "../../components/ui/Erorr";
import { getCategories, getOrders, getProducts , getBrands , getstatistics} from "../../features/product/services/productApi";

export default function AdminProductsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);
  const[brandsData , setBrandsData] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [statisticsData, setStatisticsData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse, ordersResponse, statisticsResponse , brandsResponse] = await Promise.all([
          getProducts({ page: 1, limit: 20, order: "desc" }),
          getCategories({ page: 1, limit: 20, order: "desc" }),
          getOrders({ page: 1, limit: 20, order: "desc" }),
          getstatistics({ page: 1, limit: 20, order: "desc" }),
          getBrands({ page: 1, limit: 20, order: "desc" }),
        ]);
        

        if (mounted) {
          setProductsData(productsResponse);
          setCategoriesData(categoriesResponse);
          setBrandsData(brandsResponse);
          setOrdersData(ordersResponse);
          setStatisticsData(statisticsResponse);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const products = productsData?.result || [];
  const orders = ordersData?.result || [];
  const brands = brandsData?.result || [];
  const statistics = statisticsData?.data || {};
  const totalRevenue = statistics.totalRevenue || 0;
  
  

  const unavailableCount = useMemo(() => {
    return products.filter((item) => !item.available).length;
  }, [products]);

  const recentProducts = useMemo(() => products.slice(0, 5), [products]);
  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

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
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Atelier Commerce Hub
            </span>
            <h1 className="mt-3 font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
              Catalog & Order Operations
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Live monitoring of fashion catalog metrics, revenue analytics, brand taxonomies, and recent client orders.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/products"
              className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#090D16] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110 active:scale-95"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/20 active:scale-95"
            >
              Manage Orders
            </Link>
            <Link
              to="/admin/categories"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 active:scale-95"
            >
              Manage Categories
            </Link>
            <Link
              to="/admin/brands"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 active:scale-95"
            >
              Manage Brands
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg transition hover:border-[#D4AF37]/40">
            <div className="mb-3 inline-flex rounded-xl bg-[#D4AF37]/15 p-2.5 text-[#D4AF37]">
              <FiBox className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Products</p>
            <p className="mt-1 font-serif text-3xl font-normal text-white">{productsData?.totalResults || 0}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg transition hover:border-[#D4AF37]/40">
            <div className="mb-3 inline-flex rounded-xl bg-[#D4AF37]/15 p-2.5 text-[#D4AF37]">
              <FiLayers className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</p>
            <p className="mt-1 font-serif text-3xl font-normal text-white">{categoriesData?.totalResults || 0}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg transition hover:border-[#D4AF37]/40">
            <div className="mb-3 inline-flex rounded-xl bg-[#D4AF37]/15 p-2.5 text-[#D4AF37]">
              <FiShoppingBag className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fashion Brands</p>
            <p className="mt-1 font-serif text-3xl font-normal text-white">{brands.length}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg transition hover:border-[#D4AF37]/40">
            <div className="mb-3 inline-flex rounded-xl bg-[#D4AF37]/15 p-2.5 text-[#D4AF37]">
              <FiClock className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Out of Stock</p>
            <p className="mt-1 font-serif text-3xl font-normal text-rose-400">{unavailableCount}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg transition hover:border-[#D4AF37]/40">
            <div className="mb-3 inline-flex rounded-xl bg-[#D4AF37]/15 p-2.5 text-[#D4AF37]">
              <FiShoppingBag className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Orders</p>
            <p className="mt-1 font-serif text-3xl font-normal text-white">{statistics.totalOrdersCount || 0}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg transition hover:border-[#D4AF37]/40">
            <div className="mb-3 inline-flex rounded-xl bg-[#D4AF37]/15 p-2.5 text-[#D4AF37]">
              <FiShoppingBag className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gross Orders Value</p>
            <p className="mt-1 font-serif text-3xl font-normal text-[#D4AF37]">
              ${Number(statistics.totalAllOrdersPrice || 0).toFixed(2)}
            </p>
          </article>

          <article className="rounded-2xl border border-[#D4AF37]/30 bg-[linear-gradient(135deg,#0D1322_0%,#1a1f33_100%)] p-5 shadow-lg">
            <div className="mb-3 inline-flex rounded-xl bg-[#D4AF37]/20 p-2.5 text-[#D4AF37]">
              <FiShoppingBag className="text-xl" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Net Revenue</p>
            <p className="mt-1 font-serif text-3xl font-normal text-[#D4AF37]">
              ${Number(totalRevenue).toFixed(2)}
            </p>
          </article>

          {statistics.byStatus?.map((status) => (
            <article
              key={status._id}
              className="rounded-2xl border border-white/10 bg-[#0D1322] p-5 shadow-lg"
            >
              <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2.5 text-slate-300">
                <FiShoppingBag className="text-xl" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total: {status._id}
              </p>
              <p className="mt-1 font-serif text-3xl font-normal text-white">
                ${Number(status.totalPrice || 0).toFixed(2)}
              </p>
            </article>
          ))}
        </div>

        {/* Tables/Lists Section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Recent Products */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Catalog</span>
                <h2 className="font-serif text-xl font-medium text-white">Recent Additions</h2>
              </div>
              <FiBox className="text-2xl text-[#D4AF37]/60" />
            </div>

            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product._id} className="rounded-2xl border border-white/10 bg-[#0D1322] p-4 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-base font-medium text-white">{product.name || "Apparel Item"}</p>
                    <p className="mt-0.5 text-xs text-[#D4AF37]">${Number(product.price || 0).toFixed(2)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      product.available
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {product.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              ))}

              {recentProducts.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-xs text-slate-400">
                  No products added yet.
                </p>
              )}
            </div>
          </article>

          {/* Recent Orders */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Client Orders</span>
                <h2 className="font-serif text-xl font-medium text-white">Recent Orders</h2>
              </div>
              <FiShoppingBag className="text-2xl text-[#D4AF37]/60" />
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => {
                const customer =
                  order?.user && typeof order.user === "object"
                    ? order.user.username || order.user.email || "Client"
                    : "Client";

                return (
                  <div key={order._id} className="rounded-2xl border border-white/10 bg-[#0D1322] p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white">{customer}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {order.items?.length || 0} items · <span className="text-[#D4AF37] font-serif">${Number(order.totalAmount || 0).toFixed(2)}</span>
                        </p>
                      </div>
                      <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                        {order.status || "pending"}
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recent order"}
                    </p>
                  </div>
                );
              })}

              {recentOrders.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-xs text-slate-400">
                  No order activity recorded yet.
                </p>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
