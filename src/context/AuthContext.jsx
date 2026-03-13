import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

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

const getUserIdentity = (user) => {
  if (!user) return "anonymous";
  return `${user.id}:${user.updated_at ?? ""}`;
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const userIdentityRef = useRef(getUserIdentity(null));

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    console.debug("[stability] AuthProvider mounted");
    return () => {
      console.debug("[stability] AuthProvider unmounted");
    };
  }, []);

  const applyAuthSnapshot = useCallback((nextSession) => {
    const normalizedSession = nextSession ?? null;
    const nextUser = normalizedSession?.user ?? null;
    const nextIdentity = getUserIdentity(nextUser);
    const userChanged = userIdentityRef.current !== nextIdentity;

    if (userChanged) {
      userIdentityRef.current = nextIdentity;
      setUser(nextUser);
      setSession(normalizedSession);
    }

    return { userChanged, nextUser };
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      applyAuthSnapshot(initialSession);
      setLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;

      const { userChanged, nextUser } = applyAuthSnapshot(nextSession);
      setLoading((previous) => (previous ? false : previous));

      if (import.meta.env.DEV) {
        console.debug("[auth] event", event, {
          userChanged,
          userId: nextUser?.id ?? null,
        });
      }

      if (event === "SIGNED_IN" && userChanged && nextUser) {
        const redirectPath = sessionStorage.getItem("authRedirect");
        if (redirectPath && isSafeRedirectPath(redirectPath)) {
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
  }, [applyAuthSnapshot]);

  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const checkUsername = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .single();

      if (cancelled) return;

      if (!data?.username) {
        const pending = sessionStorage.getItem("authRedirectPending");
        if (pending) return;

        navigateRef.current?.("/onboarding");
        sessionStorage.removeItem("authRedirectPending");
      }
    };

    checkUsername();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
    }),
    [session, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
