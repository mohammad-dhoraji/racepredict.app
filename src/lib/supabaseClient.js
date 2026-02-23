import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file."
  );
}

if (typeof supabaseAnonKey === "string" && supabaseAnonKey.startsWith("service_role")) {
  throw new Error(
    "Invalid VITE_SUPABASE_ANON_KEY: appears to be a service role key. Only the anon/public key should be used in the browser."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);