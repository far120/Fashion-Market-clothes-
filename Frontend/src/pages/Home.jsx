import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiStar, FiShield, FiTruck, FiRefreshCw, FiSliders, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../features/auth/hooks/useAuth";

const featuredCategories = [
  {
    name: "Women's Couture",
    desc: "Silk dresses, tailored blazers & evening wear",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    link: "/menu?category=women",
    tag: "NEW SEASON"
  },
  {
    name: "Men's Luxury Suits",
    desc: "Precision wool suits, overcoats & casual luxury",
    img: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
    link: "/menu?category=men",
    tag: "TRENDING"
  },
  {
    name: "Handbags & Accessories",
    desc: "Italian leather bags, sunglasses & fine jewelry",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    link: "/menu?category=accessories",
    tag: "ATELIER"
  },
  {
    name: "Designer Footwear",
    desc: "Hand-crafted leather boots, heels & luxury sneakers",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    link: "/menu?category=footwear",
    tag: "POPULAR"
  }
];

export default function Home() {
  const { isAuthenticated, isAdmin, isManager } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop"
            alt="Fashion Editorial Hero"
            className="w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-widest uppercase backdrop-blur-md animate-fade-in">
            <span>✨ Autumn / Winter Atelier Collection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-white leading-[1.1] font-normal">
            Redefining Modern <span className="italic font-light text-amber-400">Elegance</span> & Style
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-light leading-relaxed">
            Curated apparel crafted from premium silk, wool, and leather. Explore timeless garments designed for every occasion.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-300 transform hover:-translate-y-1"
            >
              <FiShoppingBag className="text-xl" />
              <span>Explore Collection</span>
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-base backdrop-blur-md transition-all duration-300"
              >
                <span>Join Atelier Club</span>
                <FiArrowRight className="text-lg" />
              </Link>
            ) : (
              <Link
                to="/orders"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-base backdrop-blur-md transition-all duration-300"
              >
                <span>My Orders</span>
                <FiArrowRight className="text-lg" />
              </Link>
            )}

            {(isAdmin || isManager) && (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-amber-300 border border-amber-500/40 font-bold text-base shadow-lg transition-all duration-300"
              >
                <FiSliders className="text-lg" />
                <span>Admin Hub</span>
              </Link>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto border-t border-white/10 text-white/80 text-xs sm:text-sm font-medium">
            <div>
              <div className="text-2xl font-serif text-amber-400 font-bold">100%</div>
              <div className="text-slate-400 text-xs">Sustainable Fabrics</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-amber-400 font-bold">Free</div>
              <div className="text-slate-400 text-xs">Express Delivery</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-amber-400 font-bold">30 Days</div>
              <div className="text-slate-400 text-xs">Easy Returns</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-amber-400 font-bold">4.9 ★</div>
              <div className="text-slate-400 text-xs">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">
            Curated Collections
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 dark:text-white">
            Explore Brand Essentials
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Discover tailored silhouettes and luxury everyday wardrobe staples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col min-h-[380px] border border-slate-200/60 dark:border-slate-800"
            >
              {/* Image background */}
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Tag Badge */}
              <div className="relative z-10 p-5">
                <span className="inline-block px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-amber-500/20">
                  {cat.tag}
                </span>
              </div>

              {/* Card Footer Text */}
              <div className="relative z-10 mt-auto p-6 space-y-2">
                <h3 className="text-2xl font-serif text-white font-bold group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 font-light line-clamp-2">
                  {cat.desc}
                </p>
                <div className="pt-2 inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Shop Category</span>
                  <FiArrowRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner / Value Proposition */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              ATELIER PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif leading-tight">
              Crafted For Distinction, Styled For Comfort
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every garment in our collection undergoes rigorous quality control to ensure unmatched comfort, durability, and contemporary fit. Experience luxury fashion delivered directly to your doorstep.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-slate-200 text-sm">
                <FiCheckCircle className="text-amber-400 text-lg shrink-0" />
                <span>Ethically sourced organic cotton, silk, and wool</span>
              </li>
              <li className="flex items-center gap-3 text-slate-200 text-sm">
                <FiCheckCircle className="text-amber-400 text-lg shrink-0" />
                <span>Precision tailored cuts suitable for all body silhouettes</span>
              </li>
              <li className="flex items-center gap-3 text-slate-200 text-sm">
                <FiCheckCircle className="text-amber-400 text-lg shrink-0" />
                <span>Global Express tracked shipping with customs cleared</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
              >
                <span>Browse Full Catalog</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Side Image Grid */}
          <div className="grid grid-cols-2 gap-4 relative">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"
              alt="Fashion Model 1"
              className="rounded-3xl object-cover h-72 w-full shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
            />
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
              alt="Fashion Model 2"
              className="rounded-3xl object-cover h-72 w-full shadow-2xl transform translate-y-6 rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Customer Feedback Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="flex justify-center text-amber-500 gap-1 text-xl">
            <FiStar className="fill-amber-500" />
            <FiStar className="fill-amber-500" />
            <FiStar className="fill-amber-500" />
            <FiStar className="fill-amber-500" />
            <FiStar className="fill-amber-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white">
            Loved By Fashion Enthusiasts Worldwide
          </h2>
        </div>

        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <p className="text-slate-700 dark:text-slate-300 italic text-base sm:text-lg">
            "The fit and fabric quality are unmatched. Ordering was seamless, and my package arrived nicely packaged in 2 days. Highly recommended!"
          </p>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-amber-400">
            — Elena Rostova, Verified Buyer
          </div>
        </div>

        <div>
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-amber-600 font-semibold text-sm transition-colors"
          >
            <span>Read All Verified Customer Reviews</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>

    </div>
  );
}