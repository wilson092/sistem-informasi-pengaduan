import { createBrowserRouter, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardUser from "./pages/DashboardUser";
import DataPengaduan from "./pages/DataPengaduan";
import DetailPengaduan from "./pages/DetailPengaduan";
import DataUser from "./pages/DataUser";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import MainLayout from "./components/MainLayout";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: "admin" | "user" }> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardAdminOrUserRouter />
          </ProtectedRoute>
        ),
      },
      {
        path: "pengaduan",
        element: (
          <ProtectedRoute>
            <DataPengaduan />
          </ProtectedRoute>
        ),
      },
      {
        path: "pengaduan/:id",
        element: (
          <ProtectedRoute>
            <DetailPengaduan />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requiredRole="admin">
            <DataUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Analytics />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

// Helper component to route to correct dashboard
function DashboardAdminOrUserRouter() {
  const { user } = useAuth();
  return user?.role === "admin" ? <DashboardAdmin /> : <DashboardUser />;
}
