import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import RouteGateLoader from "./RouteGateLoader";

function NoUsernameOnly({ children }) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);
  const userId = user?.id ?? null;

  useEffect(() => {
    let isMounted = true;

    const checkProfile = async () => {
      setChecking(true);

      if (!userId) {
        if (isMounted) {
          setChecking(false);
          setHasUsername(false);
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
  }, [userId, loading]);

  if (loading || checking) {
    return <RouteGateLoader subtitle="Checking your onboarding status..." />;
  }

  if (hasUsername) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default NoUsernameOnly;
