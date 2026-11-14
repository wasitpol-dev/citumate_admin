import { createClient } from "@supabase/supabase-js";

const clean = (s: string) => s.replace(/[^\x21-\x7E]/g, "");

const supabaseUrl = clean(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vwtowjxwsmwewvmvapnh.supabase.co"
);
const supabaseKey = clean(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_uAHH5O0ciLf5OraEYK3g8Q_vGTgZOc-"
);

export const supabase = createClient(supabaseUrl, supabaseKey);
