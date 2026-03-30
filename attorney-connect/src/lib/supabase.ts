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
  practice_areas: string[] | null;
  licensed_states: string[] | null;
  billing_type: string | null;
  fee_percent: number | null;
  hourly_rate: number | null;
  flat_fee: number | null;
  years_experience: number | null;
  cases_won: number | null;
  total_cases: number | null;
  recent_result: string | null;
  recent_result_amount: string | null;
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
