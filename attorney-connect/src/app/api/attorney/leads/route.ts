import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/attorney/leads?attorney_id=<clerk_user_id>
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const attorney_id = req.nextUrl.searchParams.get("attorney_id");

  // Must be authenticated and requesting own leads
  if (!userId || userId !== attorney_id) {
    return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("attorney_id", attorney_id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
