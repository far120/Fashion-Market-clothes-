import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, isAdmin , isManager } = useAuth();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#fffbeb_30%,#ecfeff_100%)] px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-7xl rounded-3xl border border-[#fed7aa] bg-white p-6 shadow-[0_24px_70px_rgba(194,65,12,0.18)] sm:p-10">
        <div className="mb-8 rounded-full bg-[#ffedd5] p-1.5 sm:w-fit">
          <div className="rounded-full bg-[linear-gradient(90deg,#f97316_0%,#ea580c_100%)] px-8 py-3 text-center text-base font-bold text-white shadow-[0_8px_24px_rgba(234,88,12,0.35)]">
            Welcome to the Smart Fashion Market System
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-wide text-[#111827] sm:text-5xl">
          Smart Fashion Market Operations, Beautifully Managed
        </h1>
        <p className="mb-8 max-w-3xl text-lg text-[#475569] sm:text-xl">
          From menu browsing and ordering to product, category, and order administration, everything runs from one clean, modern interface.
        </p>

        <div className="mb-10 flex flex-wrap gap-3">
          <Link
            to="/menu"
            className="rounded-2xl bg-[linear-gradient(90deg,#f97316_0%,#dc2626_100%)] px-8 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(220,38,38,0.28)] transition hover:brightness-110"
          >
            Explore Menu
          </Link>

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="rounded-2xl border border-[#fdba74] px-8 py-3 text-base font-semibold text-[#9a3412] transition hover:bg-[#fff7ed]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-2xl border border-[#fdba74] px-8 py-3 text-base font-semibold text-[#9a3412] transition hover:bg-[#fff7ed]"
              >
                Create Account
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link
                to="/orders"
                className="rounded-2xl border border-[#fdba74] px-8 py-3 text-base font-semibold text-[#9a3412] transition hover:bg-[#fff7ed]"
              >
                My Orders
              </Link>


              <Link
                to="/reviews"
                className="rounded-2xl bg-[linear-gradient(90deg,#facc15_0%,#eab308_100%)] border border-[#fdba74] px-8 py-3 text-base font-semibold text-[#9a3412] transition hover:bg-[#fff7ed]"
              >
                Reviews
              </Link>

              {(isAdmin || isManager) && (
                <Link
                  to="/admin/dashboard"
                  className="rounded-2xl bg-[linear-gradient(90deg,#1d4ed8_0%,#1e3a8a_100%)] px-8 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(30,58,138,0.35)] transition hover:brightness-110"
                >
                  Open Admin Panel
                </Link>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { title: "Menu & Cart", desc: "Browse dishes, search quickly, and build orders in seconds." },
            { title: "Reviews", desc: "Collect customer ratings and feedback tied to each product." },
            { title: "Admin Control", desc: "Manage products, categories, and order statuses from one place." },
          ].map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-[#fed7aa] bg-[#fffaf5] p-6 shadow-[0_8px_16px_rgba(180,83,9,0.11)] transition hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(180,83,9,0.18)]"
            >
              <h2 className="mb-2 text-2xl font-bold text-[#9a3412]">{feature.title}</h2>
              <p className="text-[#475569]">{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}