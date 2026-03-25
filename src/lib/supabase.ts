import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kahgvzzjftncetyufomc.supabase.co";
const supabaseAnonKey = "sb_publishable_0tlnDHwnwQoeSKzR51pCHw_1cXI3CWh";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (for API routes only)
export const supabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};
