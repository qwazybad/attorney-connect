import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function isAdmin(userId: string | null) {
  if (!userId) return false;
  const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return adminIds.includes(userId);
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const { data: attorney, error } = await supabaseAdmin
    .from("attorneys")
    .select("id, name, firm, outreach_email, claim_token, claimed")
    .eq("id", id)
    .single();

  if (error || !attorney) return NextResponse.json({ error: "Attorney not found" }, { status: 404 });
  if (attorney.claimed) return NextResponse.json({ error: "Profile already claimed" }, { status: 400 });
  if (!attorney.outreach_email) return NextResponse.json({ error: "No outreach email set" }, { status: 400 });

  const claimUrl = `https://www.attorneycompete.com/claim/${attorney.claim_token}`;
  const name = attorney.name ?? "there";
  const firm = attorney.firm ?? "your firm";

  const { error: emailError } = await resend.emails.send({
    from: "AttorneyCompete <noreply@attorneycompete.com>",
    to: attorney.outreach_email,
    subject: `${name}, your profile is live on AttorneyCompete`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="background: #111; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">⚖️ AttorneyCompete</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0;">Your profile is live, ${name}</h2>
          <p>We've created a profile for <strong>${name}</strong> at <strong>${firm}</strong> on AttorneyCompete — the first marketplace where attorneys compete for clients on fees.</p>
          <p style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin: 24px 0;">
            Clients in your area are already browsing attorney profiles. <strong>Claim your profile</strong> to update your fees, add your bio and photo, and start receiving leads directly.
          </p>
          <p style="font-size: 14px; color: #6b7280;">It takes less than 2 minutes. No credit card required — it&apos;s free for attorneys.</p>
          <a href="${claimUrl}" style="display: inline-block; background: #3b82f6; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 8px 0;">
            Claim Your Profile →
          </a>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">
            If you didn't request this, you can ignore this email. Your profile will remain live as a public listing.<br/>
            Questions? Reply to this email or contact us at support@attorneycompete.com
          </p>
        </div>
      </div>
    `,
  });

  if (emailError) return NextResponse.json({ error: emailError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
