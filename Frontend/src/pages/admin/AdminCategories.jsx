import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import Error from "../../components/ui/Erorr";
import { useToast } from "../../context/ToastContext";
import { createCategory, getCategories , deleteCategory } from "../../features/product/services/productApi";


export default function AdminCategoriesPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");



  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      toast?.warning("Category name is required");
      return;
    }
    try {
      await createCategory({ name: name.trim() });
      setName("");
      toast?.success("Category created");
      await refreshData();
    } catch (err) {
      toast?.error(err.message);
    }
  }



  async function refreshData() {
    try {
      setLoading(true);
      const data = await getCategories({ page: 1, limit: 100, order: "desc" });
      setCategories(data.result || []);
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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );


 async function handleDelete(categoryId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) {
      return;
    }
    try{
      await deleteCategory(categoryId);
      setCategories((prevCategories) => prevCategories.filter((c) => c._id !== categoryId));
      toast?.success("Category deleted");
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
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3">
          <span className="inline-flex w-fit rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Taxonomy Management
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
            Apparel Categories
          </h1>
          <p className="text-sm text-slate-400">
            Define high-level product groupings (e.g., Evening Wear, Outerwear, Fine Accessories).
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.2fr]">
          {/* Create Category Form */}
          <article className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="font-serif text-xl font-medium text-white">Create New Category</h2>
            <p className="mt-1 text-xs text-slate-400">
              Enter a descriptive name for your new luxury fashion category.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Category Name
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Leather Goods & Bags"
                  className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#090D16] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110 active:scale-95"
              >
                Create Category
              </button>
            </form>
          </article>

          {/* Current Categories List */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium text-white">Active Categories</h2>
                <p className="text-xs text-slate-400">{filteredCategories.length} categories registered</p>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search categories..."
                className="rounded-xl border border-white/15 bg-[#0D1322] px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="mt-6 space-y-3">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1322] p-4 transition-all hover:border-[#D4AF37]/40"
                >
                  <span className="font-serif text-base font-medium text-white">
                    {category.name}
                  </span>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
                  <p className="text-sm text-slate-400">No categories found.</p>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
