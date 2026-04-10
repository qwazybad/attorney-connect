import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const normalized = normalizePhone(phone);

  // Rate limit: max 3 codes per phone per 10 minutes
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("phone_verifications")
    .select("*", { count: "exact", head: true })
    .eq("phone", normalized)
    .gte("created_at", tenMinutesAgo);

  if ((count ?? 0) >= 3) {
    return NextResponse.json({ error: "Too many attempts. Please wait 10 minutes." }, { status: 429 });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min expiry

  await supabaseAdmin.from("phone_verifications").insert({
    phone: normalized,
    code,
    expires_at: expiresAt,
    verified: false,
  });

  try {
    await client.messages.create({
      body: `Your AttorneyCompete verification code is: ${code}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: normalized,
    });
  } catch (err) {
    console.error("Twilio error:", err);
    return NextResponse.json({ error: "Failed to send SMS. Check your phone number and try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
