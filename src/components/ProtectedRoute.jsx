import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("token");

  // If no token → not logged in
  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If token exists → allow access
  return children;
}