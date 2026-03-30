import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/attorneys?state=CA&area=personal-injury
// Public endpoint — returns all active attorneys, optionally filtered.
export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state");
  const area = req.nextUrl.searchParams.get("area");

  let query = supabaseAdmin
    .from("attorneys")
    .select(
      "id, name, firm, bio, phone, website, photo_url, image_position, practice_areas, licensed_states, billing_type, fee_percent, hourly_rate, flat_fee, years_experience, firm_size, cases_won, total_cases, recent_result, recent_result_amount, created_at"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (state) {
    query = query.contains("licensed_states", [state]);
  }
  if (area) {
    // area is a slug like "personal-injury" — do a loose keyword match against practice_areas
    const keyword = area.replace(/-/g, " ");
    query = query.ilike("practice_areas::text", `%${keyword}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
