import Spinner from "./Spinner";

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-full tracking-wide transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer";

  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-xl focus:ring-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
    gold:
      "bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 focus:ring-amber-500",
    rose:
      "bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-500 hover:to-pink-500 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 focus:ring-rose-500",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    outline:
      "border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white focus:ring-slate-900 dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900",
    ghost:
      "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 shadow-md focus:ring-rose-600",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs font-semibold gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold gap-2",
    lg: "px-7 py-3.5 text-base font-bold gap-2.5",
  };

  const selectedVariant = variants[variant] || variants.primary;
  const selectedSize = sizes[size] || sizes.md;

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${selectedVariant} ${selectedSize} ${className}`}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" className="mr-2" />
      ) : Icon ? (
        <Icon className="text-lg shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}