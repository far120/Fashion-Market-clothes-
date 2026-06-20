const defaultButtonClasses =
  "inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export default function Button({ children, className, ...props }) {
  const classes = `${defaultButtonClasses} ${className || ''}`;

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}