import { supabase } from "../lib/supabaseClient";

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Failed to get session: ${error.message}`);
  }

  if (!session) return null;

  return session.user;
}

export async function getProfile(userId) {
  if (!userId) {
    throw new Error("getProfile requires a valid userId");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserPredictions(userId) {
  if (!userId) {
    throw new Error("getUserPredictions requires a valid userId");
  }

  const { data, error } = await supabase
    .from("predictions")
    .select("*, races(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
