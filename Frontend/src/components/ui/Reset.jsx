import React from "react";

export default function ResetButton({
  onReset,
  title = "Reset",
  className,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onReset}
      disabled={disabled}
      className={`px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-gray-300 ${className || ""}`}
    >
      {title}
    </button>
  );
}