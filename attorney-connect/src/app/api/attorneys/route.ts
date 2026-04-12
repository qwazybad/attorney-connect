import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/attorneys?state=CA&area=personal-injury&limit=N
// Public endpoint — returns active attorneys, optionally filtered.
export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state");
  const area = req.nextUrl.searchParams.get("area");
  const ids = req.nextUrl.searchParams.get("ids");
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "1000"), 1000);

  let query = supabaseAdmin
    .from("attorneys")
    .select(
      "id, name, firm, bio, phone, website, photo_url, image_position, city, state, practice_areas, licensed_states, billing_type, fee_percent, hourly_rate, flat_fee, years_experience, firm_size, cases_won, total_cases, recent_result, recent_result_amount, response_time_hours, created_at"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (ids) {
    query = query.in("id", ids.split(","));
  }
  if (state) {
    query = query.contains("licensed_states", [state]);
  }
  if (area) {
    const keyword = area.replace(/-/g, " ");
    query = query.ilike("practice_areas::text", `%${keyword}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { data: data ?? [] },
    {
      headers: {
        // Cache on CDN for 2 min, serve stale for up to 10 min while revalidating
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    }
  );
}
