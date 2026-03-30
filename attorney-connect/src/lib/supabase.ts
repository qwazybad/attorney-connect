import { createClient } from "@supabase/supabase-js";

// Browser-safe client (anon key only)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  status: "pending" | "active" | "suspended" | null;
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
