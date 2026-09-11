import { useEffect, useMemo, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import Error from "../../components/ui/Erorr";
import { useToast } from "../../context/ToastContext";
import { API_BASE_URL } from "../../services/endpoints";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getBrands,
  getProducts,
  updateProduct,
} from "../../features/product/services/productApi";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
  available: "true",
};

export default function AdminProductsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);

  const backendBaseUrl = useMemo(() => {
    return API_BASE_URL.replace(/\/api\/?$/, "");
  }, []);

  function resolveImageUrl(imagePath) {
    if (!imagePath || imagePath === "default.png") {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${backendBaseUrl}${normalizedPath}`;
  }

  async function refreshData() {
    try {
      setLoading(true);
      const [productsData, categoriesData, brandsData] = await Promise.all([
        getProducts({ page: 1, limit: 100, order: "desc" }),
        getCategories({ page: 1, limit: 100, order: "desc" }),
        getBrands({ page: 1, limit: 100, order: "desc" }),
      ]);

      setProducts(productsData.result || []);
      setCategories(categoriesData.result || []);
      setBrands(brandsData.result || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((item) => map.set(item._id, item.name));
    return map;
  }, [categories]);

  const brandMap = useMemo(() => {
    const map = new Map();
    brands.forEach((item) => map.set(item._id, item.name));
    return map;
  }, [brands]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const categoryName = categoryMap.get(product.category) || "";
      const brandName = brandMap.get(product.brand) || "";
      const matchesSearch = !term || `${product.name} ${categoryName} ${brandName}`.toLowerCase().includes(term);

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && product.available) ||
        (availabilityFilter === "unavailable" && !product.available);

      return matchesSearch && matchesAvailability;
    });
  }, [products, searchTerm, categoryMap, brandMap, availabilityFilter]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function beginEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: typeof product.category === "object" ? product.category?._id || "" : product.category || "",
      brand: typeof product.brand === "object" ? product.brand?._id || "" : product.brand || "",
      available: product.available ? "true" : "false",
    });
    setImageFile(null);
  }

  function getCategoryName(product) {
    if (product.category && typeof product.category === "object") {
      return product.category.name || "Uncategorized";
    }

    return categoryMap.get(product.category) || "Uncategorized";
  }
  
  function getBrandName(product) {
    if (product.brand && typeof product.brand === "object") {
      return product.brand.name || "No brand";
    }
    return brandMap.get(product.brand) || "No brand";
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
    setImageFile(null);
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.category) {
      toast?.warning("Category is required");
      return;
    }

    if (!form.brand) {
      toast?.warning("Brand is required");
      return;
    }

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("description", form.description);
    payload.append("price", Number(form.price));
    payload.append("stock", Number(form.stock));
    payload.append("category", form.category);
    payload.append("brand", form.brand);
    payload.append("available", form.available);

    if (imageFile) {
      payload.append("image", imageFile);
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast?.success("Product updated");
      } else {
        await createProduct(payload);
        toast?.success("Product created");
      }

      resetForm();
      await refreshData();
    } catch (err) {
      toast?.error(err.message);
    }
  }

  async function handleDelete(productId) {
    try {
      await deleteProduct(productId);
      toast?.success("Product deleted");
      await refreshData();
    } catch (err) {
      toast?.error(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-8 max-w-6xl px-4">
        <Error message={error.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] px-4 py-10 text-[#FAF9F6] sm:px-6 sm:py-16">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3">
          <span className="inline-flex w-fit rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Couture Inventory
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
            Atelier Product Catalog
          </h1>
          <p className="text-sm text-slate-400">
            Create, update, and curate luxury apparel, accessories, stock counts, and brand assignments.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Panel: Form */}
          <article className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="font-serif text-xl font-medium tracking-wide text-white">
              {editingId ? "Edit Apparel Item" : "Create New Apparel Item"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Fill in the fashion product details below to update your online storefront.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Silk Evening Gown"
                  required
                  className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Detailed craftsmanship, fabric details, size & fit guide..."
                  className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Product Image
                </label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-[#D4AF37]/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30"
                />
                <p className="mt-1.5 text-[11px] text-slate-400">
                  {editingId
                    ? "Upload a new photo only if you wish to replace the current image."
                    : "Upload high-resolution lookbook image."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Price ($)
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min={1}
                    value={form.price}
                    onChange={handleChange}
                    placeholder="299.00"
                    required
                    className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Stock Quantity
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="15"
                    required
                    className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="" className="bg-[#090D16]">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id} className="bg-[#090D16]">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Brand
                  </label>
                  <select
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="" className="bg-[#090D16]">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id} className="bg-[#090D16]">
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Store Availability
                </label>
                <select
                  name="available"
                  value={form.available}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="true" className="bg-[#090D16]">Available for purchase</option>
                  <option value="false" className="bg-[#090D16]">Unavailable / Hidden</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#090D16] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110 active:scale-95"
                >
                  {editingId ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-300 transition hover:bg-white/10 active:scale-95"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </article>

          {/* Right Panel: Product List */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
              <div>
                <h2 className="font-serif text-xl font-medium tracking-wide text-white">
                  Catalog Inventory
                </h2>
                <p className="text-xs text-slate-400">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search catalog..."
                  className="rounded-xl border border-white/15 bg-[#0D1322] px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37]"
                />
                <select
                  value={availabilityFilter}
                  onChange={(event) => setAvailabilityFilter(event.target.value)}
                  className="rounded-xl border border-white/15 bg-[#0D1322] px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                >
                  <option value="all" className="bg-[#090D16]">All Statuses</option>
                  <option value="available" className="bg-[#090D16]">Available Only</option>
                  <option value="unavailable" className="bg-[#090D16]">Unavailable Only</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-white/[0.07]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <img
                        src={resolveImageUrl(product.image)}
                        alt={product.name}
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d";
                        }}
                        className="h-20 w-20 rounded-xl object-cover border border-white/10 shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      <div>
                        <h3 className="font-serif text-base font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                          {product.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                          {product.description || "No description provided."}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-slate-300">
                            {getCategoryName(product)}
                          </span>
                          <span className="rounded-full bg-[#D4AF37]/15 px-2.5 py-0.5 font-semibold text-[#D4AF37]">
                            {getBrandName(product)}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-semibold ${
                              product.available
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-rose-500/15 text-rose-300"
                            }`}
                          >
                            {product.available ? "Available" : "Unavailable"} · Stock: {product.stock ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <p className="font-serif text-xl font-medium text-[#D4AF37]">
                        ${Number(product.price || 0).toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => beginEdit(product)}
                          className="rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/20"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
                  <p className="text-sm text-slate-400">No products found matching criteria.</p>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
