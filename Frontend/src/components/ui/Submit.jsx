import Spinner from "./Spinner";

export default function Submit({
  title = "Submit",
  className = "",
  loading = false,
  disabled = false,
  loadingLabel = "Submitting...",
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        title
      )}
    </button>
  );
}