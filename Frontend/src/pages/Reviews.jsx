import { useEffect, useMemo, useState } from "react";
import Spinner from "../components/ui/Spinner";
import Error from "../components/ui/Erorr";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../features/auth/hooks/useAuth";
import {
  createReview,
  deleteReview,
  getProducts,
  getReviews,
  updateReview,
} from "../features/restaurant/services/restaurantApi";

export default function ReviewsPage() {
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function loadProducts() {
    const data = await getProducts({ page: 1, limit: 100, order: "desc" });
    const list = data.result || [];
    setProducts(list);

    if (list.length > 0 && !selectedProduct) {
      setSelectedProduct(list[0]._id);
    }
  }

  async function loadReviews(productId) {
    const data = await getReviews(productId ? { productId } : {});
    setReviews(data.reviews || []);
  }

  useEffect(() => {
    let mounted = true;

    async function loadPage() {
      try {
        setLoading(true);
        await loadProducts();
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

    loadPage();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    let mounted = true;

    async function syncReviews() {
      try {
        await loadReviews(selectedProduct);
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      }
    }

    syncReviews();

    return () => {
      mounted = false;
    };
  }, [selectedProduct]);

  const myUserId = user?._id || user?.id;

  const selectedProductName = useMemo(() => {
    return products.find((item) => item._id === selectedProduct)?.name || "Selected Product";
  }, [products, selectedProduct]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      toast?.warning("Please login first");
      return;
    }

    if (!selectedProduct) {
      toast?.warning("Choose a product first");
      return;
    }

    try {
      if (editingId) {
        await updateReview(editingId, { rating, comment });
        toast?.success("Review updated");
      } else {
        await createReview({
          productId: selectedProduct,
          rating,
          comment,
        });
        toast?.success("Review published");
      }

      setEditingId(null);
      setRating(5);
      setComment("");
      await loadReviews(selectedProduct);
    } catch (err) {
      toast?.error(err.message);
    }
  }

  function handleEdit(review) {
    setEditingId(review._id);
    setRating(review.rating || 5);
    setComment(review.comment || "");
  }

  async function handleDelete(reviewId) {
    try {
      await deleteReview(reviewId);
      toast?.success("Review deleted");
      await loadReviews(selectedProduct);
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0fdf4_0%,#ecfeff_40%,#f8fafc_100%)] px-4 py-10 sm:py-16">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1.1fr]">
        <article className="rounded-3xl border border-[#bbf7d0] bg-white p-6 shadow-[0_18px_40px_rgba(22,163,74,0.12)]">
          <h1 className="text-3xl font-black text-[#166534]">Product Reviews</h1>
          <p className="mt-2 text-sm text-[#15803d]">Help others with your feedback and ratings.</p>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-[#166534]">Product</label>
            <select
              value={selectedProduct}
              onChange={(event) => setSelectedProduct(event.target.value)}
              className="w-full rounded-xl border border-[#86efac] bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]"
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-[#dcfce7] bg-[#f7fff9] p-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#166534]">Rating</label>
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(event) => setRating(Number(event.target.value || 5))}
                className="w-full rounded-xl border border-[#86efac] bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#166534]">Comment</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="w-full rounded-xl border border-[#86efac] bg-white px-3 py-2 text-sm"
                placeholder="Share your experience"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[linear-gradient(90deg,#22c55e_0%,#15803d_100%)] px-4 py-3 text-sm font-bold text-white transition hover:brightness-110"
            >
              {editingId ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </article>

        <article className="rounded-3xl border border-[#bae6fd] bg-white p-6 shadow-[0_18px_40px_rgba(14,116,144,0.13)]">
          <h2 className="text-2xl font-black text-[#0f766e]">Reviews For {selectedProductName}</h2>

          <div className="mt-5 space-y-3">
            {reviews.map((review) => {
              const reviewUserId = review?.user?._id || review?.user?.id;
              const canManage = myUserId && reviewUserId === myUserId;

              return (
                <div key={review._id} className="rounded-xl border border-[#bae6fd] bg-[#f0f9ff] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#155e75]">{review?.user?.email || "User"}</p>
                      <p className="text-sm text-[#0369a1]">Rating: {review.rating}/5</p>
                    </div>
                    {canManage && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(review)}
                          className="rounded-lg border border-[#38bdf8] px-2 py-1 text-xs font-semibold text-[#0369a1]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review._id)}
                          className="rounded-lg border border-[#fda4af] px-2 py-1 text-xs font-semibold text-[#be123c]"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-[#334155]">{review.comment || "No comment"}</p>
                </div>
              );
            })}

            {reviews.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#bae6fd] bg-[#f0f9ff] p-4 text-sm text-[#0f766e]">
                No reviews yet for this product.
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
