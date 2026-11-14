import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vwtowjxwsmwewvmvapnh.supabase.co";

// Use SERVICE_ROLE_KEY if available (bypasses RLS for full admin control)
// Otherwise fallback to ANON_KEY
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_uAHH5O0ciLf5OraEYK3g8Q_vGTgZOc-";

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
