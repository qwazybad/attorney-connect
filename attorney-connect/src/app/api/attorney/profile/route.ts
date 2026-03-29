import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/attorney/profile?id=<clerk_user_id>
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const id = req.nextUrl.searchParams.get("id");

  // Must be authenticated and requesting own profile
  if (!userId || userId !== id) {
    return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("attorneys")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/attorney/profile — upsert attorney profile
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Always use the authenticated user's ID — never trust a client-supplied one
  const payload = { ...body, id: userId };

  const { data, error } = await supabaseAdmin
    .from("attorneys")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Profile upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
