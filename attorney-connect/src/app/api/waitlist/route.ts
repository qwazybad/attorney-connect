import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await resend.emails.send({
    from: "AttorneyCompete <noreply@attorneycompete.com>",
    to: "Jackhumphres.jh@gmail.com",
    subject: `New Waitlist Signup — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111;">New Waitlist Signup</h2>
        <p>An attorney has joined the waitlist.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #555; font-weight: bold;">Name</td><td style="padding: 8px;">${name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; color: #555; font-weight: bold;">Email</td><td style="padding: 8px;">${email}</td></tr>
        </table>
      </div>
    `,
  }).catch((err) => console.error("Waitlist email error:", err));

  return NextResponse.json({ success: true });
}
