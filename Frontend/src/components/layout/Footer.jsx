import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(90deg,#2f3792_0%,#1f2350_100%)] text-[#d8dbef]">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
        
        {/* Logo / About */}
        <div>
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
          <p className="text-sm text-[#c4cae9]">
            Premium restaurant ordering platform with real-time menu, reviews, and admin control.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="inline-flex items-center gap-2 hover:text-white">
                Home <FiArrowUpRight />
              </Link>
            </li>
            <li>
              <Link to="/login" className="inline-flex items-center gap-2 hover:text-white">
                Login <FiArrowUpRight />
              </Link>
            </li>
            <li>
              <Link to="/menu" className="inline-flex items-center gap-2 hover:text-white">
                Menu <FiArrowUpRight />
              </Link>
            </li>
            <li>
              <Link to="/orders" className="inline-flex items-center gap-2 hover:text-white">
                Orders <FiArrowUpRight />
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard" className="inline-flex items-center gap-2 hover:text-white">
                Admin Dashboard <FiArrowUpRight />
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">
            Follow Us
          </h3>
          <div className="flex gap-3 text-sm">
            <a href="#" aria-label="Facebook" className="rounded-full bg-[#2a2f68] p-2.5 text-white transition hover:bg-[#ff2f74]">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="rounded-full bg-[#2a2f68] p-2.5 text-white transition hover:bg-[#ff2f74]">
              <FaTwitter />
            </a>
            <a href="#" aria-label="LinkedIn" className="rounded-full bg-[#2a2f68] p-2.5 text-white transition hover:bg-[#ff2f74]">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-[#3f478f] text-center text-sm py-4 text-[#c4cae9]">
        © {new Date().getFullYear()} TasteCraft. All rights reserved.
      </div>
    </footer>
  );
}