import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiFilter, FiShoppingCart, FiSearch, FiX, FiCheck, FiShoppingBag, FiTag, FiStar } from "react-icons/fi";
import Spinner from "../components/ui/Spinner";
import Error from "../components/ui/Erorr";
import { getCategories, getProducts } from "../features/product/services/productApi";
import { addToCart, getCartItemQuantity, getCartTotals, readCart, syncCartWithInventory } from "../utils/cart";
import { useToast } from "../context/ToastContext";
import { API_BASE_URL } from "../services/endpoints";

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100-250", label: "$100 - $250" },
  { value: "250-plus", label: "$250+" },
];

export default function MenuPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const toast = useToast();

  const backendBaseUrl = useMemo(() => {
    return API_BASE_URL.replace(/\/api\/?$/, "");
  }, []);

  function resolveImageUrl(imagePath) {
    if (!imagePath || imagePath === "default.png") {
      return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop";
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${backendBaseUrl}${normalizedPath}`;
  }

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ page: 1, limit: 100, order: "desc" }),
          getCategories({ page: 1, limit: 100, order: "desc" }),
        ]);
        if (!mounted) {
          return;
        }

        const nextProducts = productsData.result || [];
        setProducts(nextProducts);
        setCategories(categoriesData.result || []);
        setCartItems(syncCartWithInventory(readCart(), nextProducts));
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => map.set(category._id, category.name));
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const hasCustomMin = customMinPrice !== "" && Number.isFinite(Number(customMinPrice));
    const hasCustomMax = customMaxPrice !== "" && Number.isFinite(Number(customMaxPrice));

    return products.filter((product) => {
      const candidate = `${product.name} ${product.description || ""} ${categoryMap.get(product.category) || ""}`.toLowerCase();
      const matchesSearch = !term || candidate.includes(term);

      const productCategoryId = typeof product.category === "object" ? product.category?._id : product.category;
      const matchesCategory = selectedCategory === "all" || productCategoryId === selectedCategory;

      const price = Number(product.price || 0);
      const matchesPresetPrice =
        selectedPriceRange === "all" ||
        (selectedPriceRange === "under-50" && price < 50) ||
        (selectedPriceRange === "50-100" && price >= 50 && price < 100) ||
        (selectedPriceRange === "100-250" && price >= 100 && price < 250) ||
        (selectedPriceRange === "250-plus" && price >= 250);

      const matchesCustomMin = !hasCustomMin || price >= Number(customMinPrice);
      const matchesCustomMax = !hasCustomMax || price <= Number(customMaxPrice);
      const matchesPrice = matchesPresetPrice && matchesCustomMin && matchesCustomMax;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [
    categoryMap,
    products,
    search,
    selectedCategory,
    selectedPriceRange,
    customMinPrice,
    customMaxPrice,
  ]);

  const cartTotals = useMemo(() => getCartTotals(cartItems), [cartItems]);

  function getCategoryName(product) {
    if (product.category && typeof product.category === "object") {
      return product.category.name || "Apparel";
    }

    return categoryMap.get(product.category) || "Apparel";
  }

  function handleAdd(product) {
    const existingQuantity = getCartItemQuantity(cartItems, product._id);
    const stock = Number(product.stock || 0);

    if (!product.available || stock <= 0) {
      toast?.warning("This item is currently sold out");
      return;
    }

    if (existingQuantity >= stock) {
      toast?.warning("Maximum available stock reached for this item");
      return;
    }

    const nextCart = addToCart(product, 1);
    setCartItems(syncCartWithInventory(nextCart, products));
    toast?.success(`Added "${product.name}" to your shopping bag`);
  }

  function clearFilters() {
    setSearch("");
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setCustomMinPrice("");
    setCustomMaxPrice("");
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-slate-500 font-serif italic">Loading Fashion Atelier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-12 max-w-4xl px-4">
        <Error message={error.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-10 sm:px-6 lg:px-8 font-sans pb-28">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Title Card */}
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-2xl overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
              alt="Atelier Banner"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest uppercase border border-amber-500/30">
              <FiTag /> <span>ATELIER APPAREL CATALOG</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight leading-tight">
              Curated Wardrobe & Luxury Trends
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-light">
              Explore seasonal apparel, designer jackets, silk dresses, and handcrafted footwear. Filter by category, price, or search for your favorite styles.
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            
            {/* Search Input */}
            <div className="relative flex items-center">
              <FiSearch className="absolute left-4 text-slate-400 text-lg pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search apparel, dresses, jackets, silk..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Preset Price Filter */}
            <select
              value={selectedPriceRange}
              onChange={(event) => setSelectedPriceRange(event.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all"
            >
              Reset Filters
            </button>
          </div>

          {/* Custom Price Range Row */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2">
            <input
              type="number"
              min={0}
              step="0.01"
              value={customMinPrice}
              onChange={(event) => setCustomMinPrice(event.target.value)}
              placeholder="Min Price ($)"
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500"
            />
            <input
              type="number"
              min={0}
              step="0.01"
              value={customMaxPrice}
              onChange={(event) => setCustomMaxPrice(event.target.value)}
              placeholder="Max Price ($)"
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500"
            />
            
            <div className="lg:col-span-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-2">
              <span>Showing {filteredProducts.length} of {products.length} garments</span>
              {filteredProducts.length < products.length && (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Filtered Results</span>
              )}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inStock = Boolean(product.available) && Number(product.stock || 0) > 0;
            const quantityInCart = getCartItemQuantity(cartItems, product._id);
            const isMaxInCart = quantityInCart >= Number(product.stock || 0);

            return (
              <article
                key={product._id}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
              >
                {/* Image Container with Hover Zoom & Stock Badge */}
                <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-xs ${
                        inStock
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-950/80 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {inStock ? "In Stock" : "Sold Out"}
                    </span>
                  </div>

                  {/* Rating Stars Overlay */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-amber-400 text-xs font-semibold flex items-center gap-1">
                    <FiStar className="fill-amber-400 text-[10px]" />
                    <span>4.9</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {getCategoryName(product)}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light line-clamp-2">
                      {product.description || "Luxury atelier creation with premium finish."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold font-serif text-slate-900 dark:text-amber-400">
                        ${Number(product.price || 0).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {inStock ? `${product.stock} items left` : "Out of stock"}
                      </div>
                    </div>

                    {quantityInCart > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                        {quantityInCart} in bag
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => handleAdd(product)}
                    disabled={!inStock || isMaxInCart}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                      !inStock
                        ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
                        : isMaxInCart
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/50 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                    }`}
                  >
                    <FiShoppingBag className="text-base" />
                    <span>
                      {!inStock
                        ? "Sold Out"
                        : isMaxInCart
                        ? "Max Available In Bag"
                        : "Add To Bag"}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center text-2xl">
                <FiSearch />
              </div>
              <h3 className="text-xl font-serif text-slate-900 dark:text-white font-bold">No garments match your filters</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try adjusting your search terms, broadening the category filter, or resetting custom price limits.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 text-xs font-bold uppercase tracking-wider"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Floating Bottom Cart Bar */}
      {cartTotals.itemsCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl rounded-full bg-slate-950/90 text-white p-3 sm:px-6 sm:py-3.5 shadow-2xl backdrop-blur-md border border-slate-800 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md">
              {cartTotals.itemsCount}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Bag Total ({cartTotals.itemsCount} items)</div>
              <div className="text-base font-serif font-bold text-amber-400">${cartTotals.totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <Link
            to="/orders"
            className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
          >
            <span>Proceed To Checkout</span>
            <FiShoppingBag />
          </Link>
        </div>
      )}

    </div>
  );
}

