import { supabase } from "../lib/supabaseClient";

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

  // Return a discriminated result to handle pending confirmation
  if (data.session) {
    return {
      status: "authenticated",
      user: data.user,
      session: data.session,
    };
  } else {
    return {
      status: "pending_confirmation",
      user: data.user,
      session: null,
      message: "Please check your email to confirm your account",
    };
  }
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
export async function signInWithGoogle() {
  const redirectUrl = typeof window !== "undefined" ? window.location.origin : null;

  if (!redirectUrl) {
    throw new Error("signInWithGoogle requires a browser environment");
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
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