import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiClock, FiPackage, FiShield, FiUsers, FiGrid, FiTag, FiShoppingBag, FiSliders } from "react-icons/fi";
import { useAuth } from "../../auth/hooks/useAuth";

export default function AdminDashboard() {
  const { isAdmin, isManager } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-10 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Top Header Card */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-500/30">
              ATELIER CONTROL HUB
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-normal">
              Fashion Management Portal
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-light">
              Direct access to inventory products, brand categories, order status tracking, user permissions, and system logs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
              <FiSliders />
            </div>
            <div>
              <div className="text-xs text-slate-400">System Mode</div>
              <div className="text-sm font-serif font-bold text-white uppercase">{isAdmin ? "Admin Controls" : "Manager Logs"}</div>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {isAdmin && (
            <>
              {/* Products Management */}
              <Link
                to="/admin/products"
                className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FiPackage />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    INVENTORY
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Garments & Products
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                    Add new apparel, manage pricing, update stock numbers, and upload catalog photos.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Manage Products</span>
                  <FiArrowRight />
                </div>
              </Link>

              {/* Categories Management */}
              <Link
                to="/admin/categories"
                className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FiGrid />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    TAXONOMY
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Apparel Categories
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                    Create and edit garment categories like Suits, Dresses, Footwear, Outerwear.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Manage Categories</span>
                  <FiArrowRight />
                </div>
              </Link>

              {/* Brands Management */}
              <Link
                to="/admin/brands"
                className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FiTag />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    PARTNERS
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Designer Brands
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                    Manage couture fashion labels, designer bios, and brand logos.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Manage Brands</span>
                  <FiArrowRight />
                </div>
              </Link>

              {/* Orders Matrix */}
              <Link
                to="/admin/orders"
                className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FiShoppingBag />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    LOGISTICS
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Customer Orders
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                    View customer purchases, update order status to Processing or Shipped, inspect receipts.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Review Orders</span>
                  <FiArrowRight />
                </div>
              </Link>
            </>
          )}

          {isManager && (
            <>
              {/* Users Control */}
              <Link
                to="/admin/users"
                className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FiUsers />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    ACCOUNTS
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    User Accounts & Roles
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                    Manage customer accounts, assign role permissions (User, Admin, Manager).
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Manage Users</span>
                  <FiArrowRight />
                </div>
              </Link>

              {/* Activity Logs */}
              <Link
                to="/admin/logs"
                className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FiClock />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    AUDIT
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    System Audit Logs
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                    Inspect user actions, sign-in attempts, and system administrative logs.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Audit Logs</span>
                  <FiArrowRight />
                </div>
              </Link>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

