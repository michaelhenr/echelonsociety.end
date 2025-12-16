import { Navigate } from "react-router-dom";
import api from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const token = api.getToken();
  const role = api.getUserRole();

  // No token - redirect to sign in
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Admin required but user is not admin
  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

