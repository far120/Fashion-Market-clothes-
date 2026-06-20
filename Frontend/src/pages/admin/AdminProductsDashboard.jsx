import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiBox, FiClock, FiLayers, FiShoppingBag } from "react-icons/fi";
import Spinner from "../../components/ui/Spinner";
import Error from "../../components/ui/Erorr";
import { getCategories, getOrders, getProducts , getBrands , getstatistics} from "../../features/restaurant/services/restaurantApi";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffedd5_0%,#fff7ed_44%,#f8fafc_100%)] px-4 py-10 sm:py-16">
      <section className="mx-auto max-w-7xl rounded-4xl border border-orange-100 bg-white/90 p-6 shadow-[0_24px_70px_rgba(194,65,12,0.12)] backdrop-blur sm:p-10">
        <div className="flex flex-col gap-6 border-b border-orange-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-700">
              Commerce Dashboard
            </span>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Products and orders live together.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              This dashboard is for catalog operations, category health, and order visibility without mixing in user
              management or activity logs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/products"
              className="rounded-2xl bg-[linear-gradient(90deg,#c2410c_0%,#ea580c_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(194,65,12,0.20)] transition hover:brightness-110"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="rounded-2xl bg-[linear-gradient(90deg,#0f172a_0%,#1e293b_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition hover:brightness-110"
            >
              Manage Orders
            </Link>
            <Link
              to="/admin/categories"
              className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 transition hover:bg-orange-100"
            >
              Manage Categories
            </Link>
             
            <Link
              to="/admin//brands"
              className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 transition hover:bg-orange-100"
            >
              Manage Brands
            </Link>
            
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <article className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-orange-100 p-2 text-orange-700">
              <FiBox className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-orange-700">Total Products</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{productsData?.totalResults || 0}</p>
          </article>

          <article className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-orange-100 p-2 text-orange-700">
              <FiLayers className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-orange-700">Total Categories</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{categoriesData?.totalResults || 0}</p>
          </article>

          <article className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-orange-100 p-2 text-orange-700">
              <FiShoppingBag className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-orange-700">Total Brands</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{brands.length}</p>
          </article>

          <article className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-orange-100 p-2 text-orange-700">
              <FiClock className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-orange-700">Unavailable</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{unavailableCount}</p>
          </article>
          <article className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-orange-100 p-2 text-orange-700">
              <FiShoppingBag className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-orange-700">Orders Count</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{statistics.totalOrdersCount || 0}</p>
          </article>
           <article className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-orange-100 p-2 text-orange-700">
              <FiShoppingBag className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-orange-700">Total Orders price</p>
            <p className="mt-2 text-3xl font-black text-slate-950">${Number(statistics.totalAllOrdersPrice || 0).toFixed(2)}</p>
          </article>
          <article className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <div className="mb-2 inline-flex rounded-2xl bg-orange-100 p-2 text-orange-700">
              <FiShoppingBag className="text-xl" />
            </div>
            <p className="text-sm font-semibold text-orange-700">Total Revenue</p>
            <p className="mt-2 text-3xl font-black text-slate-950">${Number(statistics.totalRevenue || 0).toFixed(2)}</p>
          </article>
         
  {statistics.byStatus?.map((status) => (
    <article
      key={status._id}
      className="rounded-3xl border border-orange-100 bg-orange-50 p-5"
    >
       <div className="mb-2 inline-flex rounded-2xl bg-orange-100 p-2 text-orange-700">
              <FiShoppingBag className="text-xl" />
            </div>
      <p className="text-sm font-semibold text-orange-700">Total price of {status._id}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">${Number(status.totalPrice || 0).toFixed(2)}</p>
    </article>
  ))}

          
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Catalog</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Recent products</h2>
              </div>
              <FiBox className="text-2xl text-slate-400" />
            </div>

            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{product.name || "Product"}</p>
                      <p className="mt-1 text-sm text-slate-500">${Number(product.price || 0).toFixed(2)}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${product.available ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                      {product.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              ))}

              {recentProducts.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No products found.
                </p>
              )}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_14px_32px_rgba(15,23,42,0.12)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-200">Orders</p>
                <h2 className="mt-1 text-xl font-black">Recent order activity</h2>
              </div>
              <FiShoppingBag className="text-2xl text-orange-200" />
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => {
                const customer = order?.user && typeof order.user === "object"
                  ? order.user.username || order.user.email || "Customer"
                  : "Customer";

                return (
                  <div key={order._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-white">{customer}</p>
                        <p className="mt-1 text-sm text-slate-300">
                          {order.items?.length || 0} items • ${Number(order.totalAmount || 0).toFixed(2)}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-200">
                        {order.status || "pending"}
                      </span>
                    </div>
                    <p className="mt-3 text-[11px] text-slate-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recent order"}
                    </p>
                  </div>
                );
              })}

              {recentOrders.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300">
                  No orders found.
                </p>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
