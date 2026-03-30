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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("attorneys")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send approval email to the attorney
  if (body.status === "active" && data.email) {
    await resend.emails.send({
      from: "AttorneyCompete <onboarding@resend.dev>",
      to: data.email,
      subject: "Your profile is live — AttorneyCompete",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111;">You're approved! 🎉</h2>
          <p>Hi ${data.name ?? "there"},</p>
          <p>Great news — your AttorneyCompete profile has been approved and is now <strong>live on the marketplace</strong>. Potential clients can find and contact you right now.</p>
          <a href="https://www.attorneycompete.com/attorney/${data.id}" style="display: inline-block; background: #3b82f6; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 8px 0;">View Your Public Profile</a>
          <p style="margin-top: 16px;">You can manage your leads, update your fees, and adjust your profile anytime from your portal.</p>
          <a href="https://www.attorneycompete.com/attorney-portal" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Go to Your Portal</a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">Questions? Reply to this email or contact us at support@attorneycompete.com</p>
        </div>
      `,
    }).catch((err) => console.error("Approval email error:", err));
  }

  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const { error } = await supabaseAdmin.from("attorneys").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
