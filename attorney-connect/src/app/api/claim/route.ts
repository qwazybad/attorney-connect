import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// GET /api/claim?token=xxx — look up claim token (public, no auth needed)
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("attorneys")
    .select("id, name, firm, city, state, practice_areas, billing_type, fee_percent, hourly_rate, claimed")
    .eq("claim_token", token)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });

  return NextResponse.json({ data });
}

// POST /api/claim?token=xxx — link authenticated Clerk user to the attorney row
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  // Find the unclaimed attorney row
  const { data: attorney, error: findError } = await supabaseAdmin
    .from("attorneys")
    .select("id, name, firm, claimed, clerk_id")
    .eq("claim_token", token)
    .maybeSingle();

  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });
  if (!attorney) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
  if (attorney.claimed) return NextResponse.json({ error: "already_claimed" }, { status: 409 });

  // Make sure this Clerk ID isn't already linked to another row
  const { data: existing } = await supabaseAdmin
    .from("attorneys")
    .select("id")
    .eq("clerk_id", userId)
    .maybeSingle();

  if (existing && existing.id !== attorney.id) {
    return NextResponse.json({ error: "account_exists" }, { status: 409 });
  }

  // Link the Clerk user to this attorney row
  const { error: updateError } = await supabaseAdmin
    .from("attorneys")
    .update({ clerk_id: userId, claimed: true })
    .eq("id", attorney.id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // Notify admin
  await resend.emails.send({
    from: "AttorneyCompete <noreply@attorneycompete.com>",
    to: "Jackhumphres.jh@gmail.com",
    subject: `Profile claimed — ${attorney.name ?? "Unknown"}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111;">Attorney Profile Claimed</h2>
        <p><strong>${attorney.name ?? "An attorney"}</strong> at <strong>${attorney.firm ?? "—"}</strong> has just claimed their profile on AttorneyCompete.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #555; font-weight: bold;">Name</td><td style="padding: 8px;">${attorney.name ?? "—"}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; color: #555; font-weight: bold;">Firm</td><td style="padding: 8px;">${attorney.firm ?? "—"}</td></tr>
          <tr><td style="padding: 8px; color: #555; font-weight: bold;">Profile ID</td><td style="padding: 8px;">${attorney.id}</td></tr>
        </table>
        <a href="https://www.attorneycompete.com/admin" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View in Admin Panel</a>
      </div>
    `,
  }).catch((err) => console.error("Claim notification email error:", err));

  return NextResponse.json({ success: true, attorney_id: attorney.id });
}
