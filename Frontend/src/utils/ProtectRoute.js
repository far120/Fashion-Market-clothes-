import { Navigate } from "react-router-dom";
import { createElement } from "react";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../features/auth/hooks/useAuth";

function LoadingFallback() {
  return createElement(
    "div",
    { className: "flex min-h-[40vh] items-center justify-center" },
    createElement(Spinner, { size: "lg" })
  );
}

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return createElement(LoadingFallback);
  }

  if (!isAuthenticated) {
    return createElement(Navigate, { to: "/login" });
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return createElement(Navigate, { to: "/", replace: true });
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return createElement(LoadingFallback);
  }

  if (isAuthenticated) {
    return createElement(Navigate, { to: "/", replace: true });
  }

  return children;
}

export default ProtectedRoute;