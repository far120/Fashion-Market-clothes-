export default function Spinner({
  size = "md",
  className = "",
  title = "Loading...",
}) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-7 h-7 border-2",
    lg: "w-12 h-12 border-3",
  };

  const selectedSize = sizes[size] || sizes.md;

  return (
    <div
      className={`inline-block ${selectedSize} border-amber-500/20 border-t-amber-600 border-r-slate-900 rounded-full animate-spin ${className}`}
      title={title}
      role="status"
    >
      <span className="sr-only">{title}</span>
    </div>
  );
}