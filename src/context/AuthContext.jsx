import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  // keep a stable ref to navigate so effects don't re-subscribe on navigation
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const isSafeRedirectPath = (path) => {
    if (typeof path !== "string" || path.length === 0) return false;
    if (!path.startsWith("/")) return false;
    if (path.startsWith("//")) return false;
    if (path.includes("\\")) return false;
    if (path.includes("://")) return false;
    if (path.includes("../") || /%2e%2e/i.test(path)) return false;
    if (path.length > 200) return false;
    return true;
  };

  // 🔥 AUTH SESSION ONLY
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setUser(session?.user ?? null);
      setLoading(false); // ✅ Loading ends here
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setLoading(false);

      // Handle OAuth redirect path
      if (session?.user && _event === "SIGNED_IN") {
        const redirectPath = sessionStorage.getItem("authRedirect");
        if (redirectPath && isSafeRedirectPath(redirectPath)) {
          // mark that a redirect is pending so username-check doesn't race
          sessionStorage.setItem("authRedirectPending", "1");
          sessionStorage.removeItem("authRedirect");
          navigateRef.current?.(redirectPath, { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 🔥 USERNAME CHECK (SEPARATE)
  useEffect(() => {
    if (!user) return;

    const checkUsername = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      // If a redirect is pending (handled by SIGNED_IN), skip onboarding navigation
      if (!data?.username) {
        const pending = sessionStorage.getItem("authRedirectPending");
        if (pending) return;

        // perform onboarding navigation and clear any pending marker
        navigateRef.current?.("/onboarding");
        sessionStorage.removeItem("authRedirectPending");
      }
    };

    checkUsername();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}