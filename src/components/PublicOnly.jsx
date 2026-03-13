import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const sanitizeRedirectPath = (path) => {
  if (typeof path !== "string" || path.length === 0) return "/home";
  if (!path.startsWith("/")) return "/home";
  if (path.startsWith("//")) return "/home";
  // Reject backslashes to avoid open-redirect bypasses like "/\\evil.com"
  if (path.includes("\\") || path[1] === "\\") return "/home";
  return path;
};

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirectPath = sanitizeRedirectPath(params.get("redirect"));

  if (loading) return null;

  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <></>;
}

export default PublicOnly;
