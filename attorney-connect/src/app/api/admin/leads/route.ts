import { NextResponse } from "next/server";
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

  const { data: leads, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Attach attorney name/firm
  const { data: attorneys } = await supabaseAdmin
    .from("attorneys")
    .select("id, name, firm");

  const attorneyMap: Record<string, { name: string | null; firm: string | null }> = {};
  attorneys?.forEach((a) => { attorneyMap[a.id] = { name: a.name, firm: a.firm }; });

  const result = leads?.map((l) => ({
    ...l,
    attorney_name: attorneyMap[l.attorney_id]?.name ?? null,
    attorney_firm: attorneyMap[l.attorney_id]?.firm ?? null,
  }));

  return NextResponse.json({ data: result });
}
