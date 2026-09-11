import { useState, useEffect } from "react";
import { FiLogOut, FiMenu, FiX, FiShoppingBag, FiUser, FiSliders, FiHome, FiGrid, FiPackage, FiStar } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { getCartTotals } from "../../utils/cart";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated, isAdmin, isManager, user, logout } = useAuth();
  const location = useLocation();

  const userName = user?.username || "Guest";

  useEffect(() => {
    const updateCount = () => {
      const totals = getCartTotals();
      setCartCount(totals.itemsCount);
    };

    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  function handleLogout() {
    logout();
    setIsMobileMenuOpen(false);
  }

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) =>
    `relative px-3.5 py-2 text-sm font-medium transition-all duration-200 rounded-full flex items-center gap-1.5 ${
      isActive(path)
        ? "text-slate-900 bg-slate-100 dark:text-white dark:bg-slate-800 font-semibold shadow-xs"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-amber-200 text-xs py-1.5 px-4 text-center tracking-widest font-medium uppercase flex items-center justify-center gap-2">
        <span>✨ FREE EXPRESS SHIPPING ON ORDERS OVER $150</span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="hidden sm:inline text-amber-300">NEW AUTUMN / WINTER COLLECTION ARRIVED</span>
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950 to-slate-800 flex items-center justify-center text-amber-400 font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform duration-300 border border-amber-500/30">
              FM
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                FASHION<span className="text-amber-600 font-normal">MARKET</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-slate-400 font-semibold -mt-1">
                LUXURY ATELIER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center space-x-1 lg:space-x-2 font-sans">
            <li>
              <Link to="/" className={navLinkStyle("/")}>
                <FiHome className="text-base" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className={navLinkStyle("/menu")}>
                <FiGrid className="text-base" />
                Shop Catalog
              </Link>
            </li>
            <li>
              <Link to="/reviews" className={navLinkStyle("/reviews")}>
                <FiStar className="text-base" />
                Reviews
              </Link>
            </li>

            {isAuthenticated && (
              <li>
                <Link to="/orders" className={navLinkStyle("/orders")}>
                  <FiPackage className="text-base" />
                  My Orders
                </Link>
              </li>
            )}
          </ul>

          {/* Right Action Icons & User Control */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Cart Icon Button */}
            <Link
              to="/menu"
              className="relative p-2.5 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Shopping Cart"
            >
              <FiShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[11px] font-bold text-white shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  Join Us
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs uppercase">
                    {userName.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {userName}
                  </span>
                </Link>

                {(isAdmin || isManager) && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all"
                  >
                    <FiSliders className="text-xs" />
                    Admin
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="text-lg" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/menu"
              className="relative p-2 rounded-full text-slate-700 dark:text-slate-200"
            >
              <FiShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fade-in">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiHome /> Home
            </Link>
            <Link
              to="/menu"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiGrid /> Shop Catalog
            </Link>
            <Link
              to="/reviews"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiStar /> Customer Reviews
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiPackage /> My Orders
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser /> Profile ({userName})
                </Link>

                {(isAdmin || isManager) && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiSliders /> Admin Panel
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 text-left"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <div className="pt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="text-center py-3 rounded-2xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center py-3 rounded-2xl font-semibold bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}