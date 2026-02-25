import { supabase } from "../lib/supabaseClient";

const sanitizeRedirectPath = (path) => {
  if (typeof path !== "string") return "/";
  const trimmed = path.trim();
  if (trimmed.length === 0) return "/";
  if (trimmed.length > 200) return "/";
  if (!trimmed.startsWith("/")) return "/";
  if (trimmed.startsWith("//")) return "/";
  if (trimmed.includes("\\")) return "/";
  if (trimmed.includes("://")) return "/";
  // reject explicit or encoded traversal
  try {
    const decoded = decodeURIComponent(trimmed);
    if (decoded.includes("../") || /%2e%2e/i.test(trimmed) || decoded.startsWith("//")) return "/";
  } catch {
    return "/";
  }

  return trimmed;
};

/* =========================
   Email / Password Sign Up
========================= */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (data.session) {
    return {
      status: "authenticated",
      user: data.user,
      session: data.session,
    };
  }

  return {
    status: "pending_confirmation",
    user: data.user,
    session: null,
    message: "Please check your email to confirm your account",
  };
}

/* =========================
   Email / Password Sign In
========================= */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/* =========================
   Google OAuth
========================= */
export async function signInWithGoogle(redirectPath = "/") {
  const origin = typeof window !== "undefined" ? window.location.origin : null;

  if (!origin) {
    throw new Error("signInWithGoogle requires a browser environment");
  }

  const safePath = sanitizeRedirectPath(redirectPath);

  // Store redirect path in sessionStorage to retrieve after OAuth callback
  if (safePath !== "/") {
    sessionStorage.setItem("authRedirect", safePath);
  } else {
    // clear any stale redirect that may exist
    sessionStorage.removeItem("authRedirect");
  }

  // Use dynamic redirectTo based on environment
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: origin,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/* =========================
   Logout
========================= */
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
