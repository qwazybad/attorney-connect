import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/attorneys/:id — public profile for a single active attorney
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("attorneys")
    .select(
      "id, name, firm, bio, phone, website, photo_url, image_position, city, practice_areas, licensed_states, billing_type, fee_percent, hourly_rate, flat_fee, years_experience, firm_size, cases_won, total_cases, recent_result, recent_result_amount, created_at"
    )
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data });
}
