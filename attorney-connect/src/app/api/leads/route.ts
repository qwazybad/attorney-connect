import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      first_name,
      last_name,
      email,
      phone,
      legal_issue,
      state,
      message,
      attorney_id,
    } = body as {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      legal_issue: string;
      state: string;
      message?: string;
      attorney_id: string;
    };

    // Validate required fields
    if (!first_name || !last_name || !email || !legal_issue || !state || !attorney_id) {
      return NextResponse.json(
        { error: "Missing required fields: first_name, last_name, email, legal_issue, state, attorney_id" },
        { status: 400 }
      );
    }

    // 1. Fetch attorney webhook config (uses service role key — bypasses RLS)
    const { data: attorney, error: attorneyError } = await supabaseAdmin
      .from("attorneys")
      .select("webhook_url, field_mapping, name, outreach_email")
      .eq("id", attorney_id)
      .single();

    if (attorneyError || !attorney) {
      return NextResponse.json(
        { error: "Attorney not found" },
        { status: 404 }
      );
    }

    // 2. Save lead to Supabase
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("leads")
      .insert({
        attorney_id,
        first_name,
        last_name,
        email,
        phone: phone ?? null,
        legal_issue,
        state,
        message: message ?? null,
        sent_to_webhook: false,
      })
      .select()
      .single();

    if (leadError) {
      console.error("Lead insert error:", leadError);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    // 3. Fire webhook if configured
    let webhookFired = false;

    if (attorney.webhook_url) {
      // Apply field mapping — default to our field names if no mapping defined
      const mapping: Record<string, string> = attorney.field_mapping ?? {};

      const rawPayload: Record<string, string | undefined> = {
        first_name,
        last_name,
        email,
        phone,
        legal_issue,
        state,
        message,
      };

      // Build the mapped payload: use mapped key names where provided
      const mappedPayload: Record<string, string | undefined> = {};
      for (const [ourField, value] of Object.entries(rawPayload)) {
        const crmField = mapping[ourField] ?? ourField;
        mappedPayload[crmField] = value;
      }

      try {
        const webhookRes = await fetch(attorney.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...mappedPayload,
            _meta: {
              lead_id: lead.id,
              attorney_id,
              submitted_at: lead.created_at,
            },
          }),
        });

        webhookFired = webhookRes.ok;

        // Update lead record to mark webhook sent
        await supabaseAdmin
          .from("leads")
          .update({ sent_to_webhook: webhookFired })
          .eq("id", lead.id);
      } catch (webhookErr) {
        console.error("Webhook delivery failed:", webhookErr);
        // Don't fail the whole request — lead is already saved
      }
    }

    // 4. Send notification emails
    const leadRows = `
      <tr><td style="padding:8px;color:#555;font-weight:bold;">Name</td><td style="padding:8px;">${first_name} ${last_name}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#555;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
      <tr><td style="padding:8px;color:#555;font-weight:bold;">Phone</td><td style="padding:8px;">${phone ?? "—"}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#555;font-weight:bold;">Legal Issue</td><td style="padding:8px;">${legal_issue}</td></tr>
      <tr><td style="padding:8px;color:#555;font-weight:bold;">State</td><td style="padding:8px;">${state}</td></tr>
      ${message ? `<tr style="background:#f9f9f9"><td style="padding:8px;color:#555;font-weight:bold;vertical-align:top;">Details</td><td style="padding:8px;">${message}</td></tr>` : ""}
    `;

    const adminHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#111;">New Lead — ${attorney.name ?? "Unknown Attorney"}</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">${leadRows}</table>
        <a href="https://www.attorneycompete.com/admin" style="display:inline-block;background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View in Admin</a>
      </div>
    `;

    const attorneyHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#111;">You have a new lead!</h2>
        <p style="color:#555;">Someone submitted a consultation request through your AttorneyCompete profile. Here are their details:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">${leadRows}</table>
        <p style="color:#555;font-size:14px;">Log in to your portal to manage this lead.</p>
        <a href="https://www.attorneycompete.com/attorney-portal" style="display:inline-block;background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Go to Portal</a>
      </div>
    `;

    await Promise.allSettled([
      resend.emails.send({
        from: "AttorneyCompete <noreply@attorneycompete.com>",
        to: "Jackhumphres.jh@gmail.com",
        subject: `New lead — ${first_name} ${last_name} (${legal_issue})`,
        html: adminHtml,
      }),
      attorney.outreach_email
        ? resend.emails.send({
            from: "AttorneyCompete <noreply@attorneycompete.com>",
            to: attorney.outreach_email,
            subject: `New lead: ${first_name} ${last_name} — ${legal_issue}`,
            html: attorneyHtml,
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      webhook_fired: webhookFired,
    });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
