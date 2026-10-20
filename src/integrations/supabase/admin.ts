import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./client";

// Owner page needs to see every booking, so use the service role key (it skips the database rules).
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.PRACTICE-ONLY.this-is-not-a-real-key-service-role";

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
