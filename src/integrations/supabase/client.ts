import { createClient } from "@supabase/supabase-js";

// Your Supabase project. Until you connect one, the app runs on built-in sample data.
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "https://YOUR-PROJECT.supabase.co").trim();
export const SUPABASE_PUBLISHABLE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "YOUR-PUBLISHABLE-KEY").trim();

// Connected only when both values are filled in with real ones (an empty or half-filled .env.local keeps the sample data)
export const isConnected =
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(SUPABASE_URL) && !SUPABASE_URL.includes("YOUR-PROJECT") && SUPABASE_PUBLISHABLE_KEY.length > 20;

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
