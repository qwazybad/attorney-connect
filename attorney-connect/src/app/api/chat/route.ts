import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Fetch active attorneys from DB
  const { data: attorneys } = await supabaseAdmin
    .from("attorneys")
    .select("id, name, firm, practice_areas, licensed_states, state, city, billing_type, fee_percent, hourly_rate, flat_fee, bio, cases_won, total_cases")
    .eq("status", "active");

  const attorneyList = (attorneys ?? [])
    .map((a) => {
      const fee =
        a.billing_type === "contingency"
          ? `${a.fee_percent ?? 33}% contingency`
          : a.billing_type === "hourly"
          ? `$${a.hourly_rate ?? "?"}/hr`
          : `$${a.flat_fee ?? "?"} flat fee`;
      const location = [a.city, a.state].filter(Boolean).join(", ") || (a.licensed_states ?? []).join(", ");
      const successRate =
        a.total_cases > 0 ? Math.round((a.cases_won / a.total_cases) * 100) + "% success rate" : null;
      return `- ID: ${a.id} | ${a.name} (${a.firm}) | ${location} | ${fee}${successRate ? ` | ${successRate}` : ""} | Practice areas: ${(a.practice_areas ?? []).join(", ")}`;
    })
    .join("\n");

  const systemPrompt = `You are a helpful legal assistant for AttorneyCompete, a marketplace that connects clients with attorneys.

Your job is to:
1. Understand what legal help the user needs
2. If they have NOT mentioned a state or city, ask for their location before recommending anyone — just ask once, keep it short (e.g. "What state are you in?")
3. Once you have their legal issue AND location, match them with the most relevant attorneys from the list below
4. Recommend 1-3 attorneys that best fit their situation
5. Be warm, clear, and concise — you're helping regular people, not lawyers

IMPORTANT: Do not recommend attorneys until you know the user's location. If they haven't mentioned a state or city, ask for it first.

When recommending attorneys, format your response like this:
- Briefly acknowledge their situation (1 sentence)
- Explain what type of attorney they need (1 sentence)
- List your top 1-3 matches with a short reason for each
- End with a short encouraging note

Always include the attorney's ID in your recommendation using this exact format: [ATTORNEY:id] — this is used to show their profile card.

If no attorneys in the list match their location or need, say so honestly and suggest they browse the full directory at attorneycompete.com/compare.

Available attorneys:
${attorneyList || "No attorneys currently available."}

Keep responses conversational and under 200 words.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Claude API error:", err);
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
  }

  const result = await response.json();
  const text = result.content?.[0]?.text ?? "";

  // Extract attorney IDs referenced in response
  const idMatches = [...text.matchAll(/\[ATTORNEY:([^\]]+)\]/g)];
  const matchedIds = idMatches.map((m) => m[1]);

  // Clean the text — remove the [ATTORNEY:id] tokens for display
  const cleanText = text.replace(/\[ATTORNEY:[^\]]+\]/g, "").trim();

  return NextResponse.json({ text: cleanText, matchedIds });
}
