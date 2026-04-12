import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });

  // Look up the attorney row by clerk_id to get their actual UUID
  const { data: attorney } = await supabaseAdmin
    .from("attorneys")
    .select("id")
    .eq("clerk_id", userId)
    .maybeSingle();

  if (!attorney) return NextResponse.json({ data: [] });

  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("attorney_id", attorney.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
