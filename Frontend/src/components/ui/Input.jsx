export default function Input({label,error,className,...props}) {
  const baseClasses =
    "border rounded-lg px-3 py-2 outline-none transition-all duration-200";

  const focusClasses = "focus:ring-2 focus:ring-slate-400";

  const errorClasses = error
    ? "border-red-500 focus:ring-red-400"
    : "border-gray-300";

  const classes = `
    ${baseClasses}
    ${focusClasses}
    ${errorClasses}
    ${className || ""}
  `;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="mb-1 block text-sm font-semibold text-[#545778]">
          {label}
        </label>
      )}

      <input {...props} className={classes} />

      {error && (
        <p className="mt-2 text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}