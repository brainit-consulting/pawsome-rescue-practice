import { createClient } from "@supabase/supabase-js";

// Your Supabase project. Until you connect one, the app runs on built-in sample data.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://YOUR-PROJECT.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "YOUR-PUBLISHABLE-KEY";

export const isConnected = !SUPABASE_URL.includes("YOUR-PROJECT");

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
