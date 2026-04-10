import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  if (!phone || !code) return NextResponse.json({ error: "Phone and code required" }, { status: 400 });

  const normalized = normalizePhone(phone);
  const now = new Date().toISOString();

  const { data } = await supabaseAdmin
    .from("phone_verifications")
    .select("id, code, expires_at, verified")
    .eq("phone", normalized)
    .eq("verified", false)
    .gte("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: "Code expired or not found. Request a new one." }, { status: 400 });
  }

  if (data.code !== code.trim()) {
    return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
  }

  // Mark as verified
  await supabaseAdmin
    .from("phone_verifications")
    .update({ verified: true })
    .eq("id", data.id);

  return NextResponse.json({ success: true });
}
