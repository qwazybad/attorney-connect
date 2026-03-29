import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser-side usage (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side usage (service role key — never expose to browser)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export type Attorney = {
  id: string; // Clerk user ID
  name: string | null;
  firm: string | null;
  bio: string | null;
  phone: string | null;
  website: string | null;
  photo_url: string | null;
  webhook_url: string | null;
  field_mapping: Record<string, string> | null;
  created_at: string;
};

export type Lead = {
  id: string;
  attorney_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  legal_issue: string;
  state: string;
  message: string | null;
  sent_to_webhook: boolean;
  created_at: string;
};
