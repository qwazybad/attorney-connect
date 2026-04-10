import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({ to: normalized, code: code.trim() });

    if (check.status !== "approved") {
      return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
    }
  } catch (err) {
    console.error("Twilio Verify check error:", err);
    return NextResponse.json({ error: "Code expired or not found. Request a new one." }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
