import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiClock, FiPackage, FiShield, FiUsers } from "react-icons/fi";
import Error from "../../../components/ui/Erorr";
import Spinner from "../../../components/ui/Spinner";
import { useAuth } from "../../auth/hooks/useAuth";

export default function AdminDashboard() {
  const { isAdmin, isManager } = useAuth();
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#111827_0%,#1f2937_42%,#334155_100%)] px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-7xl rounded-4xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(250,250,255,0.88)_54%,rgba(236,248,255,0.9)_100%)] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.42)] backdrop-blur sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="inline-flex rounded-full border border-slate-200 bg-slate-950 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white">
              Admin Hub
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Choose the right dashboard.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Split the administration experience into two clear operating rooms: commerce for products and orders,
              and people for users and activity logs.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {isAdmin && (
              <Link
                to="/admin/dashboard/products"
                className="group rounded-2xl bg-[linear-gradient(90deg,#0f172a_0%,#1e293b_100%)] px-5 py-4 text-white shadow-[0_14px_32px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Commerce</p>
                    <h2 className="mt-1 text-lg font-black">Products and orders</h2>
                  </div>
                  <FiPackage className="text-2xl text-sky-200 transition group-hover:translate-x-1" />
                </div>
              </Link>
              )}

               { isManager && (
              <Link
                to="/admin/dashboard/users"
                className="group rounded-2xl bg-[linear-gradient(90deg,#1e293b_0%,#334155_100%)] px-5 py-4 text-white shadow-[0_14px_32px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">People</p>
                    <h2 className="mt-1 text-lg font-black">Users and logs</h2>
                  </div>
                  <FiUsers className="text-2xl text-emerald-200 transition group-hover:translate-x-1" />
                </div>
              </Link>
               )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Navigation</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">Two focused dashboards</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Design</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">Premium global look</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Flow</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">Less clutter, more clarity</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-sky-200">
              Command Overview
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
               {isAdmin && (
                <>
              <Link
                to="/admin/products"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Manage</p>
                <h3 className="mt-2 text-lg font-black">Products</h3>
              </Link>
              <Link
                to="/admin/orders"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Review</p>
                <h3 className="mt-2 text-lg font-black">Orders</h3>
              </Link>
                </>
               )}
              {isManager && (
                <>
              <Link
                to="/admin/users"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Manage</p>
                <h3 className="mt-2 text-lg font-black">Users</h3>
              </Link>
              <Link
                to="/admin/logs"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Inspect</p>
                <h3 className="mt-2 text-lg font-black">Logs</h3>
              </Link>
                </>
                )}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(96,165,250,0.18)_0%,rgba(14,165,233,0.08)_100%)] p-5">
              <div className="flex items-center gap-3">
                <FiBarChart2 className="text-2xl text-sky-300" />
                <div>
                  <p className="text-sm font-semibold text-sky-200">System posture</p>
                  <p className="text-sm text-slate-300">Each dashboard now has a single purpose and a cleaner visual hierarchy.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-slate-300">
              <FiClock className="text-sky-300" />
              <span>Optimized for quick admin access across desktop and mobile.</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
