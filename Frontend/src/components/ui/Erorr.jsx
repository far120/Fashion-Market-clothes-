import { FiAlertCircle } from "react-icons/fi";

export default function Error({ message }) {
  if (!message) return null;

  const displayMsg = typeof message === "object" ? message.message || JSON.stringify(message) : message;

  return (
    <div className="w-full p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-200 flex items-center gap-3 shadow-xs animate-shake">
      <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
      <span className="text-sm font-medium">{displayMsg}</span>
    </div>
  );
}