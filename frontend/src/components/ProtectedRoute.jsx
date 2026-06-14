import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children, allowedRoles }) {
  const { loading, currentUser, isAuthenticated } = useAuth();

  // Wait for auth state initialization before rendering protected pages.
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-slate-600">
        <p className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-4 text-center text-sm font-medium shadow-sm">Checking authentication...</p>
      </div>
    );
  }

  // Redirect unauthenticated users to login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Enforce role-based access for protected routes.
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;