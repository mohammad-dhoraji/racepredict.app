import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isBoneyardCapture } from "../lib/isBoneyardCapture";
import RouteGateLoader from "./RouteGateLoader";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const captureMode = isBoneyardCapture();

  if (captureMode) {
    return children;
  }

  if (loading) {
    return <RouteGateLoader subtitle="Checking your session..." />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
