import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAdmin(userId: string | null) {
  if (!userId) return false;
  const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return adminIds.includes(userId);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const { data: lead, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: attorney } = await supabaseAdmin
    .from("attorneys")
    .select("id, name, firm, photo_url")
    .eq("id", lead.attorney_id)
    .maybeSingle();

  return NextResponse.json({ data: { ...lead, attorney } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const allowed = ["status", "notes", "attorney_id"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  // If reassigning, fetch old attorney name for the activity log
  let oldAttorneyName: string | null = null;
  if ("attorney_id" in update) {
    const { data: existing } = await supabaseAdmin
      .from("leads")
      .select("attorney_id")
      .eq("id", id)
      .single();
    if (existing?.attorney_id && existing.attorney_id !== update.attorney_id) {
      const { data: oldAtty } = await supabaseAdmin
        .from("attorneys")
        .select("name, firm")
        .eq("id", existing.attorney_id)
        .maybeSingle();
      oldAttorneyName = oldAtty?.name ?? oldAtty?.firm ?? existing.attorney_id;
    }
  }

  const { data, error } = await supabaseAdmin
    .from("leads")
    .update(update)
    .eq("id", id)
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

  // Log attorney assignment/reassignment to activity
  if ("attorney_id" in update) {
    const { data: newAtty } = await supabaseAdmin
      .from("attorneys")
      .select("name, firm")
      .eq("id", update.attorney_id as string)
      .maybeSingle();
    const newName = newAtty?.name ?? newAtty?.firm ?? String(update.attorney_id);
    const body = oldAttorneyName
      ? `Reassigned from ${oldAttorneyName} to ${newName}`
      : `Assigned to ${newName}`;
    await supabaseAdmin.from("lead_activity").insert({ lead_id: id, type: "status_change", body });
  }

  // Return updated lead with attorney info
  const { data: attorney } = await supabaseAdmin
    .from("attorneys")
    .select("id, name, firm, photo_url")
    .eq("id", data.attorney_id)
    .maybeSingle();

  return NextResponse.json({ data: { ...data, attorney } });
}
