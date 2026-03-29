import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAdmin(userId: string | null) {
  if (!userId) return false;
  const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return adminIds.includes(userId);
}

export async function GET() {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: attorneys, error } = await supabaseAdmin
    .from("attorneys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get lead counts per attorney
  const { data: leads } = await supabaseAdmin
    .from("leads")
    .select("attorney_id");

  const counts: Record<string, number> = {};
  leads?.forEach((l) => { counts[l.attorney_id] = (counts[l.attorney_id] ?? 0) + 1; });

  const result = attorneys?.map((a) => ({ ...a, lead_count: counts[a.id] ?? 0 }));
  return NextResponse.json({ data: result });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const id = crypto.randomUUID();

  const { data, error } = await supabaseAdmin
    .from("attorneys")
    .insert({ ...body, id, status: body.status ?? "active" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
