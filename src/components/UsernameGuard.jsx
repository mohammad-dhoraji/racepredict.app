import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isBoneyardCapture } from "../lib/isBoneyardCapture";
import { supabase } from "../lib/supabaseClient";
import RouteGateLoader from "./RouteGateLoader";

function UsernameGuard({ children }) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasUsername, setHasUsername] = useState(null);
  const userId = user?.id ?? null;
  const captureMode = isBoneyardCapture();

  useEffect(() => {
    let isMounted = true;

    const checkProfile = async () => {
      if (captureMode) {
        if (isMounted) {
          setHasUsername(true);
          setChecking(false);
        }
        return;
      }

      setChecking(true);

      if (!userId) {
        if (isMounted) {
          setChecking(false);
          setHasUsername(null);
        }
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .maybeSingle();

      if (!isMounted) return;

      if (!error && data?.username) {
        setHasUsername(true);
      } else {
        setHasUsername(false);
      }

      setChecking(false);
    };

    if (!loading) {
      checkProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [captureMode, userId, loading]);

  if (captureMode) {
    return children;
  }

  if (loading || checking) {
    return <RouteGateLoader subtitle="Loading your profile..." />;
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (!hasUsername) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

export default UsernameGuard;
