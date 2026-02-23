import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UsernameGuard({ children }) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasUsername, setHasUsername] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkProfile = async () => {
      setChecking(true);

      if (!user) {
        if (isMounted) {
          setChecking(false);
          setHasUsername(null);
        }
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
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
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        Loading...
      </div>
    );
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