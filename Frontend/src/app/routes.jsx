import { createBrowserRouter } from "react-router-dom";
import RootRoute from "./RootRoute";
import Login from "../features/auth/components/Login";
import HomePage from "../pages/Home";
import NotFound from "../pages/NotFound";
import Register from "../features/auth/components/Register";
import Profile from "../features/User/components/profile";
import { ProtectedRoute, PublicOnlyRoute } from "../utils/ProtectRoute";
import AdminUsers from "../features/User/components/AdminUsers";
import AdminUserLogs from "../features/User/components/AdminUserLogs";
import ResetPassword from "../features/User/components/ResetPassword";
import AdminDashboard from "../features/User/components/AdminDashboard";
import MenuPage from "../pages/Menu";
import OrdersPage from "../pages/Orders";
import ReviewsPage from "../pages/Reviews";
import AdminProductsPage from "../pages/admin/AdminProducts";
import AdminCategoriesPage from "../pages/admin/AdminCategories";
import AdminOrdersPage from "../pages/admin/AdminOrders";
import AdminUsersDashboardPage from "../pages/admin/AdminUsersDashboard";
import AdminProductsDashboardPage from "../pages/admin/AdminProductsDashboard";
import AdminBrandsPage from "../pages/admin/AdminBrand";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        )
      },
      {
        path: "register",
        element: (
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "menu",
        element: <MenuPage />,
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        )
      },
      {
        path: "reviews",
        element: <ReviewsPage />,
      },
      {
        path: "reset-password",
        element: (
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute allowedRoles={["manager"]}>
            <AdminUsers />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/logs",
        element: (
          <ProtectedRoute allowedRoles={["manager"]}>
            <AdminUserLogs />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/products",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProductsPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/categories",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCategoriesPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/orders",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrdersPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/dashboard/users",
        element: (
          <ProtectedRoute allowedRoles={["manager"]}>
            <AdminUsersDashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/dashboard/products",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProductsDashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path:"/admin/brands",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminBrandsPage />
          </ProtectedRoute>
        )
      },
     

    ]
  }
]);