import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function getAttorneyId(userId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("attorneys")
    .select("id")
    .eq("clerk_id", userId)
    .maybeSingle();
  return data?.id ?? null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const attorneyId = await getAttorneyId(userId);
  if (!attorneyId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await params;

  // Verify ownership
  const { data: lead } = await supabaseAdmin
    .from("leads").select("id").eq("id", id).eq("attorney_id", attorneyId).maybeSingle();
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabaseAdmin
    .from("lead_activity")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const attorneyId = await getAttorneyId(userId);
  if (!attorneyId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await params;
  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Note body required" }, { status: 400 });

  // Verify ownership
  const { data: lead } = await supabaseAdmin
    .from("leads").select("id").eq("id", id).eq("attorney_id", attorneyId).maybeSingle();
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabaseAdmin
    .from("lead_activity")
    .insert({ lead_id: id, type: "note", body: body.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
