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
} from "../../features/restaurant/services/restaurantApi";

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
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#fffbeb_45%,#f8fafc_100%)] px-4 py-10">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.2fr]">
        <article className="rounded-3xl border border-[#fed7aa] bg-white p-6 shadow-[0_18px_50px_rgba(194,65,12,0.16)]">
          <h1 className="text-3xl font-black text-[#9a3412]">Admin Products</h1>
          <p className="mt-1 text-sm text-[#c2410c]">Create and update restaurant menu items.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              required
              className="w-full rounded-xl border border-[#fdba74] bg-[#fff7ed] px-3 py-2 text-sm"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Description"
              className="w-full rounded-xl border border-[#fdba74] bg-[#fff7ed] px-3 py-2 text-sm"
            />
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#9a3412]">Product Image</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-[#fdba74] bg-[#fff7ed] px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-[#9a3412]">
                {editingId ? "Choose a file only if you want to replace current image" : "Upload product image"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="price"
                type="number"
                step="0.01"
                min={1}
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="rounded-xl border border-[#fdba74] bg-[#fff7ed] px-3 py-2 text-sm"
              />
              <input
                name="stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
                className="rounded-xl border border-[#fdba74] bg-[#fff7ed] px-3 py-2 text-sm"
              />
            </div>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#fdba74] bg-[#fff7ed] px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#fdba74] bg-[#fff7ed] px-3 py-2 text-sm"
            >
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <select
              name="available"
              value={form.available}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#fdba74] bg-[#fff7ed] px-3 py-2 text-sm"
            >
              <option value="true">Available</option>
              <option value="false">Not available</option>
            </select>

            <p className="text-xs text-[#9a3412]">
              Stock controls the final availability state, so set stock to `0` when the item should be unavailable.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="submit"
                className="rounded-xl bg-[linear-gradient(90deg,#fb923c_0%,#ea580c_100%)] px-4 py-3 text-sm font-bold text-white"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[#fdba74] px-4 py-3 text-sm font-semibold text-[#9a3412]"
              >
                Reset
              </button>
            </div>
          </form>
        </article>

        <article className="rounded-3xl border border-[#fcd34d] bg-white p-6 shadow-[0_18px_50px_rgba(217,119,6,0.14)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-[#a16207]">Current Products</h2>
            <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search product by name"
                className="w-full rounded-xl border border-[#fbbf24] bg-[#fffbeb] px-3 py-2 text-sm lg:w-64"
              />
              <select
                value={availabilityFilter}
                onChange={(event) => setAvailabilityFilter(event.target.value)}
                className="w-full rounded-xl border border-[#fbbf24] bg-[#fffbeb] px-3 py-2 text-sm lg:w-44"
              >
                <option value="all">All availability</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {filteredProducts.map((product) => (
              <div key={product._id} className="rounded-xl border border-[#fde68a] bg-[#fffbeb] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={resolveImageUrl(product.image)}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";
                      }}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div>
                    <p className="font-bold text-[#92400e]">{product.name}</p>
                    <p className="text-sm text-[#a16207]">{product.description || "No description"}</p>
                    <p className="text-xs text-[#78716c]">
                      Category: {getCategoryName(product)}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#b45309]">
                      {product.available ? "Available" : "Not available"} • Stock {product.stock ?? 0}
                    </p>
                    </div>
                  </div>
                  <p className="text-xl font-black text-[#78350f]">${Number(product.price || 0).toFixed(2)}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => beginEdit(product)}
                    className="rounded-lg border border-[#fbbf24] px-3 py-1 text-xs font-semibold text-[#a16207]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
                    className="rounded-lg border border-[#fda4af] px-3 py-1 text-xs font-semibold text-[#be123c]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#fde68a] bg-[#fffbeb] p-4 text-sm text-[#a16207]">
                No products found.
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
