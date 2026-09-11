import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter } from "react-icons/fa";
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-auto">
      {/* Guarantees Strip */}
      <div className="border-b border-slate-900 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl shrink-0">
              <FiTruck />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Complimentary Express Shipping</h4>
              <p className="text-xs text-slate-400">On all global orders over $150</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl shrink-0">
              <FiRefreshCw />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Hassle-Free 30-Day Returns</h4>
              <p className="text-xs text-slate-400">Pre-paid return labels included</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl shrink-0">
              <FiShield />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Authentic & Sustainable Fabrics</h4>
              <p className="text-xs text-slate-400">Handcrafted by master artisans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Bio */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-serif font-bold text-xl shadow-lg">
              FM
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              FASHION<span className="text-amber-500 font-normal">MARKET</span>
            </span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Curating modern elegance and timeless apparel. From luxury everyday wear to runway couture, discover effortless style crafted for distinction.
          </p>

          {/* Newsletter Box */}
          <div className="pt-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-2">
              Subscribe to Private Sales & Lookbooks
            </h5>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center max-w-sm">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full px-4 py-2.5 rounded-l-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-r-2xl text-sm transition-colors flex items-center justify-center"
              >
                <FiArrowRight />
              </button>
            </form>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
            Collections
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <Link to="/menu" className="hover:text-amber-400 transition-colors">Women's Outerwear</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-amber-400 transition-colors">Men's Tailored Suits</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-amber-400 transition-colors">Silk & Evening Dresses</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-amber-400 transition-colors">Designer Footwear</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-amber-400 transition-colors">Luxury Accessories</Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <Link to="/orders" className="hover:text-amber-400 transition-colors">Order Tracking</Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-amber-400 transition-colors">Verified Reviews</Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-amber-400 transition-colors">My Account</Link>
            </li>
            <li>
              <span className="cursor-pointer hover:text-amber-400 transition-colors">Shipping & Returns</span>
            </li>
            <li>
              <span className="cursor-pointer hover:text-amber-400 transition-colors">Size Guide & Care</span>
            </li>
          </ul>
        </div>

        {/* Connect & Socials */}
        <div>
          <h4 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
            Connect
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            Follow our atelier lookbooks & behind-the-scenes stories.
          </p>
          <div className="flex gap-2.5">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 flex items-center justify-center transition-all"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="Pinterest"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 flex items-center justify-center transition-all"
            >
              <FaPinterestP />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 flex items-center justify-center transition-all"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 flex items-center justify-center transition-all"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FASHION MARKET ATELIER. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}