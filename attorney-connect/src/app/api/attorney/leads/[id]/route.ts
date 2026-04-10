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

  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("attorney_id", attorneyId) // enforce ownership
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const attorneyId = await getAttorneyId(userId);
  if (!attorneyId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await params;
  const body = await req.json();

  // Only allow updating status and notes
  const allowed = ["status", "notes"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const { data, error } = await supabaseAdmin
    .from("leads")
    .update(update)
    .eq("id", id)
    .eq("attorney_id", attorneyId) // enforce ownership
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log status change to activity
  if ("status" in update) {
    await supabaseAdmin.from("lead_activity").insert({
      lead_id: id,
      type: "status_change",
      body: `Status changed to "${update.status}"`,
    });
  }

  return NextResponse.json({ data });
}
