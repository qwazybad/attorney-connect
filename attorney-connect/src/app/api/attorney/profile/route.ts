import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// GET /api/attorney/profile?id=<clerk_user_id>
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const id = req.nextUrl.searchParams.get("id");

  // Must be authenticated and requesting own profile
  if (!userId || userId !== id) {
    return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("attorneys")
    .select("*")
    .eq("clerk_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/attorney/profile — upsert attorney profile
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Find existing row by clerk_id
  const { data: existing } = await supabaseAdmin
    .from("attorneys")
    .select("id")
    .eq("clerk_id", userId)
    .maybeSingle();

  let data, error;

  if (existing) {
    // Strip id from body so we never overwrite the row's primary key
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _ignored, ...updateBody } = body;
    ({ data, error } = await supabaseAdmin
      .from("attorneys")
      .update({ ...updateBody, clerk_id: userId })
      .eq("id", existing.id)
      .select()
      .single());
  } else {
    // New direct signup — id and clerk_id both = userId for simplicity
    ({ data, error } = await supabaseAdmin
      .from("attorneys")
      .insert({ ...body, id: userId, clerk_id: userId })
      .select()
      .single());
  }

  if (error) {
    console.error("Profile upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send confirmation email to the attorney when they submit their application
  if (body.status === "claimed_pending" && body.email) {
    await resend.emails.send({
      from: "AttorneyCompete <noreply@attorneycompete.com>",
      to: body.email,
      subject: "We received your application — AttorneyCompete",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111;">Application Received!</h2>
          <p>Hi ${body.name ?? "there"},</p>
          <p>Thanks for applying to join AttorneyCompete. We've received your application and our team is reviewing your credentials.</p>
          <p style="background: #f9f9f9; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px;">
            You'll hear back from us within <strong>2 business days</strong>. Once approved, your profile will go live on the marketplace and you'll start receiving leads directly in your portal.
          </p>
          <p>In the meantime, you can log into your portal to update your bio, photo, and practice areas.</p>
          <a href="https://www.attorneycompete.com/attorney-portal" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">Visit Your Portal</a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">Questions? Reply to this email or contact us at support@attorneycompete.com</p>
        </div>
      `,
    }).catch((err) => console.error("Attorney confirmation email error:", err));
  }

  // Send admin notification when a new application is submitted
  if (body.status === "claimed_pending") {
    await resend.emails.send({
      from: "AttorneyCompete <noreply@attorneycompete.com>",
      to: "Jackhumphres.jh@gmail.com",
      subject: "New Attorney Application — AttorneyCompete",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111;">New Attorney Application</h2>
          <p>A new attorney has applied to join AttorneyCompete and is pending approval.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; color: #555; font-weight: bold;">Name</td><td style="padding: 8px;">${body.name ?? "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; color: #555; font-weight: bold;">Firm</td><td style="padding: 8px;">${body.firm ?? "—"}</td></tr>
            <tr><td style="padding: 8px; color: #555; font-weight: bold;">Phone</td><td style="padding: 8px;">${body.phone ?? "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; color: #555; font-weight: bold;">Email</td><td style="padding: 8px;">${body.email ?? "—"}</td></tr>
            <tr><td style="padding: 8px; color: #555; font-weight: bold;">Billing</td><td style="padding: 8px;">${body.billing_type ?? "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; color: #555; font-weight: bold;">States</td><td style="padding: 8px;">${(body.licensed_states ?? []).join(", ") || "—"}</td></tr>
          </table>
          <a href="https://www.attorneycompete.com/admin" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Review in Admin Panel</a>
        </div>
      `,
    }).catch((err) => console.error("Email send error:", err));
  }

  return NextResponse.json({ data });
}
