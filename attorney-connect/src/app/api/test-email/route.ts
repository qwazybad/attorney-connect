import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const { data, error } = await resend.emails.send({
    from: "AttorneyCompete <noreply@attorneycompete.com>",
    to: "Jackhumphres.jh@gmail.com",
    subject: "Test Email — AttorneyCompete",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111;">Test Email ✅</h2>
        <p>This is a test email from AttorneyCompete. If you're reading this, Resend is working correctly!</p>
      </div>
    `,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
