import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle } from "react-icons/fi";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    console.error("useToast must be used within ToastProvider");
    return null;
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    try {
      if (!message) {
        console.warn("Toast message is empty");
        return;
      }
      const id = Date.now() + Math.random();
      const validDuration = Math.max(duration || 3000, 1000);
      setToasts((prev) => [...prev, { id, message, type, duration: validDuration }]);
    } catch (error) {
      console.error("Error adding toast:", error);
    }
  }, []);

  const removeToast = useCallback((id) => {
    try {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    } catch (error) {
      console.error("Error removing toast:", error);
    }
  }, []);

  const toast = useMemo(() => ({
    success: (msg, duration) => addToast(msg, "success", duration),
    error: (msg, duration) => addToast(msg, "error", duration),
    info: (msg, duration) => addToast(msg, "info", duration),
    warning: (msg, duration) => addToast(msg, "warning", duration),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="fixed top-5 right-5 space-y-3 z-50 max-w-xs">
        {toasts.map((toastItem) => (
          <ToastItem key={toastItem.id} toast={toastItem} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Toast Item Component with auto-dismiss
const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <FiCheckCircle className="w-5 h-5" />;
      case "error":
        return <FiXCircle className="w-5 h-5" />;
      case "warning":
        return <FiAlertCircle className="w-5 h-5" />;
      case "info":
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
      default:
        return "text-blue-800";
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "info":
      default:
        return "text-blue-500";
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border shadow-md animate-slideIn ${getBgColor()}`}
    >
      <div className={getIconColor()}>{getIcon()}</div>
      <p className={`flex-1 text-sm font-medium ${getTextColor()}`}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-400 hover:text-gray-600"
        aria-label="Close toast"
      >
        ✕
      </button>
    </div>
  );
};

// Usage example:
// const toast = useToast();
// toast.success("Saved successfully!");
// toast.error("An error occurred ❌");
// toast.warning("Please check your input");
// toast.info("FYI: Something happened");