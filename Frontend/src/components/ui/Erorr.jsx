// src/components/ui/Error.jsx
export default function Error({ message }) {
  if (!message) return null; // لو مفيش رسالة، متظهرش حاجة

  return (
    <div className="w-full p-4 bg-red-100 border border-red-400 text-red-800 rounded-md flex items-center">
      <svg
        className="w-5 h-5 mr-2 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-4a1 1 0 012 0v4a1 1 0 01-2 0V6zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

// example usage
// <Error message="Something went wrong!" />
// <Error message={error.message} />