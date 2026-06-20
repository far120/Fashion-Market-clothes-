import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import Error from "../../components/ui/Erorr";
import { useToast } from "../../context/ToastContext";
import { createCategory, getCategories , deleteCategory } from "../../features/restaurant/services/restaurantApi";


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
    <div className="min-h-screen bg-[linear-gradient(180deg,#ecfdf5_0%,#f0fdfa_50%,#f8fafc_100%)] px-4 py-10">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.2fr]">
        <article className="rounded-3xl border border-[#86efac] bg-white p-6 shadow-[0_18px_50px_rgba(22,163,74,0.16)]">
          <h1 className="text-3xl font-black text-[#166534]">Admin Categories</h1>
          <p className="mt-2 text-sm text-[#15803d]">Create menu categories for product management.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Category name"
              className="w-full rounded-xl border border-[#86efac] bg-[#f0fdf4] px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[linear-gradient(90deg,#22c55e_0%,#15803d_100%)] px-4 py-3 text-sm font-bold text-white"
            >
              Create Category
            </button>
          </form>
        </article>

        <article className="rounded-3xl border border-[#67e8f9] bg-white p-6 shadow-[0_18px_50px_rgba(14,116,144,0.14)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-[#0f766e]">Current Categories</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search category by name"
              className="w-full max-w-xs rounded-xl border border-[#67e8f9] bg-[#ecfeff] px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-5 space-y-3">
            {filteredCategories.map((category) => (
              <div key={category._id} className="rounded-xl border border-[#a5f3fc] bg-[#ecfeff] p-4">
                <p className="font-bold text-[#155e75]">{category.name}</p>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="mt-2 rounded-xl bg-red-500 px-3 py-1 text-sm font-bold text-white" >Delete </button>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#67e8f9] bg-[#ecfeff] p-4 text-sm text-[#0f766e]">
                No categories found.
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
