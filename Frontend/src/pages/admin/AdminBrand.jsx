import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import Error from "../../components/ui/Erorr";
import { useToast } from "../../context/ToastContext";
import { createBrand , getBrands , deleteBrand } from "../../features/product/services/productApi";

export default function AdminBrandsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [brands, setBrands] = useState([]);

  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");



    async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      toast?.warning("Brand name is required");
      return;
    }

    try {
      await createBrand({ name: name.trim() });
      setName("");
      toast?.success("Brand created");
      await refreshData();
    } catch (err) {
      toast?.error(err.message);
    }
  }


async function refreshData() {
    try {
      setLoading(true);
      const data = await getBrands({ page: 1, limit: 100, order: "desc" });
      setBrands(data.result || []);
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

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );



  async function handleDelete(brandId) {
   const confirmDelete = window.confirm("Are you sure you want to delete this brand? This action cannot be undone.");
   if (!confirmDelete) {
    return;
   }
   try{
    await deleteBrand(brandId);
    setBrands((prev) => prev.filter((item) => item._id !== brandId));
    toast?.success("Brand deleted successfully");
   }catch (err) {
    toast?.error(err.message || "Failed to delete brand");
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
            Brand Partnerships
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
            Fashion Brands & Designers
          </h1>
          <p className="text-sm text-slate-400">
            Register and manage featured luxury labels, design houses, and fashion ateliers.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.2fr]">
          {/* Create Brand Form */}
          <article className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="font-serif text-xl font-medium text-white">Add New Brand</h2>
            <p className="mt-1 text-xs text-slate-400">
              Enter the official brand or designer label name.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Brand Name
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Maison Atelier"
                  className="w-full rounded-xl border border-white/15 bg-[#0D1322] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#090D16] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110 active:scale-95"
              >
                Create Brand
              </button>
            </form>
          </article>

          {/* Current Brands List */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium text-white">Registered Brands</h2>
                <p className="text-xs text-slate-400">{filteredBrands.length} brands in catalog</p>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search brands..."
                className="rounded-xl border border-white/15 bg-[#0D1322] px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="mt-6 space-y-3">
              {filteredBrands.map((brand) => (
                <div
                  key={brand._id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1322] p-4 transition-all hover:border-[#D4AF37]/40"
                >
                  <span className="font-serif text-base font-medium text-white">
                    {brand.name}
                  </span>
                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              ))}

              {filteredBrands.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
                  <p className="text-sm text-slate-400">No brands found.</p>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
