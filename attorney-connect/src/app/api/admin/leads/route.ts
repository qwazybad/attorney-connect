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
  const page = Math.max(0, parseInt(url.searchParams.get("page") ?? "0"));
  const limit = Math.min(Math.max(1, parseInt(url.searchParams.get("limit") ?? "25")), 100);
  const search = (url.searchParams.get("search") ?? "").trim();
  const status = url.searchParams.get("status") ?? "";
  const attorney_id = url.searchParams.get("attorney_id") ?? "";

  const from = page * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (attorney_id) query = query.eq("attorney_id", attorney_id);
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,legal_issue.ilike.%${search}%`
    );
  }

  const { data: leads, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Attach attorney names for this page's leads only
  const attorneyIds = [...new Set(leads?.map((l) => l.attorney_id) ?? [])];
  const { data: attorneys } = attorneyIds.length > 0
    ? await supabaseAdmin.from("attorneys").select("id, name, firm").in("id", attorneyIds)
    : { data: [] };

  const attorneyMap: Record<string, { name: string | null; firm: string | null }> = {};
  attorneys?.forEach((a) => { attorneyMap[a.id] = { name: a.name, firm: a.firm }; });

  const result = leads?.map((l) => ({
    ...l,
    attorney_name: attorneyMap[l.attorney_id]?.name ?? null,
    attorney_firm: attorneyMap[l.attorney_id]?.firm ?? null,
  })) ?? [];

  return NextResponse.json({ data: result, total: count ?? 0 });
}
