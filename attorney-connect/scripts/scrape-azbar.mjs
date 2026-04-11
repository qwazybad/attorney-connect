/**
 * AZ State Bar scraper — seeds AttorneyCompete with Phoenix, AZ active attorneys.
 *
 * Usage:
 *   node scripts/scrape-azbar.mjs
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 * Inserts attorneys as unclaimed seeded profiles (id prefix: azbar_<EntityNumber>)
 * No emails are sent — profiles just sit in the DB until you decide to contact them.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env.local ──────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SUPABASE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE env vars in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── AZ Bar API config ────────────────────────────────────────────────────────
const API_BASE = "https://api-proxy.azbar.org";
const HEADERS = {
  userid: "publictools",
  password: "12B631CC-5922-4EF8-8978-23CF2F32EA8D",
  "Content-Type": "application/json",
};
const PAGE_SIZE = 50;
const DELAY_MS = 150; // polite delay between pages

// ── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function titleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function fetchPage(page, seed) {
  const res = await fetch(
    `${API_BASE}/MemberSearch/Search/?PageSize=${PAGE_SIZE}&Page=${page}&Seed=${seed ?? "null"}&Shuffle=false`,
    {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        City: "Phoenix",
        State: "AZ",
        MemberStatus: "Active",
      }),
    }
  );
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  if (!json.IsSuccess) throw new Error(json.Error || "API failure");
  return json.Result;
}

function mapAttorney(row) {
  return {
    id: `azbar_${row.EntityNumber}`,
    name: [row.FirstName, row.LastName].filter(Boolean).join(" "),
    firm: row.Company || null,
    email: row.Email || null,
    phone: row.PrimaryPhone || null,
    photo_url: row.ProfilePicUrl || null,
    bar_license: row.BarNumber || null,
    city: titleCase(row.Address?.City || "Phoenix"),
    state: row.Address?.State || "AZ",
    licensed_states: ["AZ"],
    practice_areas: [],
    billing_type: "contingency",
    fee_percent: 33,
    status: "unclaimed",
    unclaimed: true,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Fetching page 1 to get total count...");
  const first = await fetchPage(1, null);
  const { TotalCount: total, Seed: seed, Results: firstResults } = first;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  console.log(`${total} active Phoenix attorneys across ${totalPages} pages\n`);

  const allRows = [...firstResults];

  for (let page = 2; page <= totalPages; page++) {
    try {
      const result = await fetchPage(page, seed);
      allRows.push(...result.Results);
    } catch (err) {
      console.error(`  Page ${page} error: ${err.message} — retrying once`);
      await sleep(1000);
      try {
        const result = await fetchPage(page, seed);
        allRows.push(...result.Results);
      } catch {
        console.error(`  Page ${page} failed again, skipping`);
      }
    }

    if (page % 20 === 0 || page === totalPages) {
      console.log(`  Fetched ${page}/${totalPages} pages — ${allRows.length} attorneys`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nInserting ${allRows.length} attorneys into Supabase...`);

  const BATCH = 100;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < allRows.length; i += BATCH) {
    const batch = allRows.slice(i, i + BATCH).map(mapAttorney);
    const batchNum = Math.floor(i / BATCH) + 1;
    const totalBatches = Math.ceil(allRows.length / BATCH);

    const { error } = await supabase
      .from("attorneys")
      .upsert(batch, { onConflict: "id", ignoreDuplicates: false });

    if (error) {
      console.error(`  Batch ${batchNum}/${totalBatches} error: ${error.message}`);
      failed += batch.length;
    } else {
      inserted += batch.length;
    }

    if (batchNum % 10 === 0 || batchNum === totalBatches) {
      console.log(`  Upserted batch ${batchNum}/${totalBatches}`);
    }
  }

  console.log(`\nDone! ${inserted} upserted, ${failed} failed.`);
  console.log("No emails sent. Profiles are unclaimed and invisible until you decide to reach out.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
