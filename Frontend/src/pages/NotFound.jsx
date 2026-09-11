import { FiHome, FiGrid, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16 font-sans">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
          LOOKBOOK MISSING
        </div>

        <h1 className="text-8xl font-serif text-amber-400 font-normal tracking-tighter">
          404
        </h1>

        <h2 className="text-3xl font-serif font-bold tracking-tight">
          Page Out Of Stock
        </h2>

        <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed max-w-md mx-auto">
          The collection or page you are searching for does not exist, has been relocated, or is currently undergoing an editorial update.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <FiHome />
            <span>Return To Home</span>
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <FiGrid />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}