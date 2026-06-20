import { FiAlertTriangle, FiHome, FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#353d9a_0%,#2b307b_48%,#8453ad_100%)] px-4 py-10 sm:py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-3xl bg-[#f7f7fb] p-8 text-center shadow-[0_24px_70px_rgba(19,23,79,0.38)] sm:p-12">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#ecefff] px-4 py-1 text-sm font-bold tracking-wide text-[#5057a1]">
          <FiAlertTriangle />
          Error
        </p>
        <h1 className="mb-3 text-7xl font-extrabold text-[#171b3d] sm:text-8xl">404</h1>
        <h2 className="mb-4 text-3xl font-bold text-[#2b3278] sm:text-4xl">Page Not Found</h2>
        <p className="mb-8 max-w-md text-lg text-[#5a5f85]">
          Sorry, the page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#3d3fa5_0%,#1d2146_100%)] px-8 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(31,35,82,0.35)] transition hover:brightness-110"
          >
            <FiHome />
            Go Home
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#cfd4ea] px-8 py-3 text-base font-semibold text-[#2a2f68] transition hover:bg-[#ecefff]"
          >
            <FiLogIn />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}