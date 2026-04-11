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

  // Fetch all attorneys in pages to bypass Supabase's 1000-row default limit
  const PAGE = 1000;
  let attorneys: Record<string, string>[] = [];
  let from = 0;
  while (true) {
    const { data, error: pageError } = await supabaseAdmin
      .from("attorneys")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE - 1);
    if (pageError) return NextResponse.json({ error: pageError.message }, { status: 500 });
    if (!data || data.length === 0) break;
    attorneys = attorneys.concat(data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  // Get lead counts per attorney
  const { data: leads } = await supabaseAdmin
    .from("leads")
    .select("attorney_id");

  const counts: Record<string, number> = {};
  leads?.forEach((l) => { counts[l.attorney_id] = (counts[l.attorney_id] ?? 0) + 1; });

  const result = attorneys.map((a) => ({ ...a, lead_count: counts[a.id] ?? 0 }));
  return NextResponse.json({ data: result });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const id = crypto.randomUUID();
  const claim_token = crypto.randomUUID();

  const { data, error } = await supabaseAdmin
    .from("attorneys")
    .insert({ ...body, id, claim_token, claimed: false, status: body.status ?? "active" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
