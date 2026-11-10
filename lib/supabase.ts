import { createClient } from "@supabase/supabase-js";

// Clés publiques : la sécurité est assurée par les règles (RLS) de Supabase.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
