import { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, isManager, user, logout } = useAuth();

  const userName = user?.username || "User";
  const baseLinkClass = "transition hover:text-[#ffc3d4]";

  function handleLogout() {
    logout();
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="bg-[linear-gradient(90deg,#2f3792_0%,#1f2350_100%)] text-white shadow-[0_10px_28px_rgba(17,21,58,0.45)]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
                <Link to="/">
  <svg viewBox="0 0 680 420" width="110" height="68" xmlns="http://www.w3.org/2000/svg">
    <polygon points="340,38 435,90 435,194 340,246 245,194 245,90" fill="#ffffff" opacity="0.06"/>
    <polygon points="340,50 423,98 423,186 340,234 257,186 257,98" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.35"/>
    <text x="340" y="168" textAnchor="middle" fontFamily="monospace" fontSize="76" fontWeight="700" fill="#ffffff" letterSpacing="-2" opacity="0.95">MF</text>
    <circle cx="340" cy="206" r="4" fill="#EF9F27"/>
    <text x="340" y="278" textAnchor="middle" fontFamily="'Segoe UI', sans-serif" fontSize="21" fontWeight="500" fill="#ffffff" letterSpacing="6">MOSTAFA ELFAR</text>
    <line x1="230" y1="293" x2="450" y2="293" stroke="#EF9F27" strokeWidth="1.5"/>
    <text x="340" y="318" textAnchor="middle" fontFamily="'Segoe UI', sans-serif" fontSize="12.5" fontWeight="400" fill="#a0a8e8" letterSpacing="3">MERN STACK DEVELOPER</text>
  </svg>
</Link>
          </div>
          <ul className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <li>
              <Link to="/menu" className={baseLinkClass}>Menu</Link>
            </li>

            {isAuthenticated && (
              <li>
                <Link to="/orders" className={baseLinkClass}>Orders</Link>
              </li>
            )}

            {!isAuthenticated && (
              <>
                <li>
                  <Link to="/login" className={baseLinkClass}>Login</Link>
                </li>
                <li>
                  <Link to="/register" className={baseLinkClass}>Register</Link>
                </li>
              </>
            )}

            {isAuthenticated && (
              <>
                <li>
                  <Link to="/profile" className={baseLinkClass}>Profile</Link>
                </li>
                {(isAdmin || isManager) && ( 
                    <li>
                      <Link to="/admin/dashboard" className={baseLinkClass}>Admin Hub</Link>
                    </li>
                )}
                <li className="rounded-full bg-[#2a2f68] px-3 py-1 text-xs tracking-wide text-[#d3d8ff]">
                  {isAdmin ? "ADMIN" : isManager ? "Manager" : "User"}
                </li>
                <li className="text-[#f9d4de]">{userName}</li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#7078cb] px-3 py-1.5 text-xs uppercase tracking-wide text-white transition hover:bg-[#2a2f68]"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
          <button
            type="button"
            className="md:hidden rounded-lg bg-[#2a2f68] p-2 hover:bg-[#1f2350]"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <ul id="mobile-nav" className="pb-4 md:hidden space-y-2 text-sm font-semibold">
            <li>
              <Link
                to="/menu"
                className="block rounded-lg bg-[#2a2f68] px-4 py-2 transition hover:bg-[#1f2350]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Menu
              </Link>
            </li>

            {!isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block rounded-lg bg-[#2a2f68] px-4 py-2 transition hover:bg-[#1f2350]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block rounded-lg bg-[#2a2f68] px-4 py-2 transition hover:bg-[#1f2350]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && (
              <>
                <li className="rounded-lg bg-[#2a2f68] px-4 py-2 text-[#f9d4de]">
                  Signed in as {userName}
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="block rounded-lg bg-[#2a2f68] px-4 py-2 transition hover:bg-[#1f2350]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="block rounded-lg bg-[#2a2f68] px-4 py-2 transition hover:bg-[#1f2350]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                </li>

                {(isAdmin || isManager) && (
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block rounded-lg bg-[#2a2f68] px-4 py-2 transition hover:bg-[#1f2350]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Hub
                      </Link>
                    </li>
                )}
                <li>
                  <button
                    type="button"
                    className="block w-full rounded-lg bg-[#2a2f68] px-4 py-2 text-left transition hover:bg-[#1f2350]"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>
    </header>
  );
}