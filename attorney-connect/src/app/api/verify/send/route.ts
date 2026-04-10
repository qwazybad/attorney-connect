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
  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const normalized = normalizePhone(phone);

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verifications.create({ to: normalized, channel: "sms" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Twilio Verify send error:", msg);
    return NextResponse.json({ error: `Twilio error: ${msg}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
