export default function Input({ label, error, className = "", icon: Icon, ...props }) {
  const baseClasses =
    "w-full rounded-2xl border px-4 py-3 text-sm transition-all duration-300 outline-none bg-white/80 dark:bg-slate-900/80 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-xs";

  const statusClasses = error
    ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
    : "border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 dark:border-slate-700 dark:focus:border-amber-400 dark:focus:ring-amber-400/15";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none text-lg">
            <Icon />
          </div>
        )}
        <input
          {...props}
          className={`${baseClasses} ${statusClasses} ${Icon ? "pl-11" : ""} ${className}`}
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
          <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
          {error}
        </p>
      )}
    </div>
  );
}