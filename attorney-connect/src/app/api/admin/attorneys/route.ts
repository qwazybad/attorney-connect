import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAdmin(userId: string | null) {
  if (!userId) return false;
  const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return adminIds.includes(userId);
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = req.nextUrl;

  // ?all=1 — lightweight full list for dropdowns (id, name, firm only)
  if (url.searchParams.get("all") === "1") {
    const { data, error } = await supabaseAdmin
      .from("attorneys")
      .select("id, name, firm")
      .order("name", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data ?? [] });
  }

  const page = Math.max(0, parseInt(url.searchParams.get("page") ?? "0"));
  const limit = Math.min(Math.max(1, parseInt(url.searchParams.get("limit") ?? "25")), 100);
  const search = (url.searchParams.get("search") ?? "").trim();
  const status = url.searchParams.get("status") ?? "";

  const from = page * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("attorneys")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (search) {
    query = query.or(`name.ilike.%${search}%,firm.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: attorneys, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Lead counts for this page's attorneys only
  const ids = attorneys?.map((a) => a.id) ?? [];
  const { data: leads } = ids.length > 0
    ? await supabaseAdmin.from("leads").select("attorney_id").in("attorney_id", ids)
    : { data: [] };

  const leadCounts: Record<string, number> = {};
  leads?.forEach((l) => { leadCounts[l.attorney_id] = (leadCounts[l.attorney_id] ?? 0) + 1; });

  const result = attorneys?.map((a) => ({ ...a, lead_count: leadCounts[a.id] ?? 0 })) ?? [];

  return NextResponse.json({ data: result, total: count ?? 0 });
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
