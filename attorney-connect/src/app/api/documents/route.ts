import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAdmin(userId: string | null) {
  if (!userId) return false;
  const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return adminIds.includes(userId);
}

async function getAttorneyRow(clerkId: string) {
  const { data } = await supabaseAdmin
    .from("attorneys")
    .select("id")
    .eq("clerk_id", clerkId)
    .maybeSingle();
  return data;
}

// GET /api/documents?attorney_id=xxx OR ?lead_id=xxx
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const attorney_id = req.nextUrl.searchParams.get("attorney_id");
  const lead_id = req.nextUrl.searchParams.get("lead_id");

  // Attorneys can only see their own docs
  if (!isAdmin(userId)) {
    const attorney = await getAttorneyRow(userId);
    if (!attorney) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (attorney_id && attorney_id !== attorney.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (lead_id) {
      // Verify this lead belongs to the attorney
      const { data: lead } = await supabaseAdmin.from("leads").select("id").eq("id", lead_id).eq("attorney_id", attorney.id).maybeSingle();
      if (!lead) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  let query = supabaseAdmin.from("documents").select("*").order("created_at", { ascending: false });
  if (lead_id) query = query.eq("lead_id", lead_id);
  else if (attorney_id) query = query.eq("attorney_id", attorney_id).is("lead_id", null);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/documents — multipart upload
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = isAdmin(userId);
  let attorneyRowId: string | null = null;

  if (!admin) {
    const attorney = await getAttorneyRow(userId);
    if (!attorney) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    attorneyRowId = attorney.id;
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const attorney_id = form.get("attorney_id") as string | null;
  const lead_id = form.get("lead_id") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: "File must be under 20MB" }, { status: 400 });

  // Non-admin: enforce ownership
  if (!admin) {
    if (attorney_id && attorney_id !== attorneyRowId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (lead_id) {
      const { data: lead } = await supabaseAdmin.from("leads").select("id").eq("id", lead_id).eq("attorney_id", attorneyRowId!).maybeSingle();
      if (!lead) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const folder = lead_id ? `leads/${lead_id}` : `attorneys/${attorney_id ?? attorneyRowId}`;
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;

  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin.storage
    .from("documents")
    .upload(path, bytes, { contentType: file.type || `application/${ext}`, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data, error: dbError } = await supabaseAdmin
    .from("documents")
    .insert({
      attorney_id: attorney_id ?? attorneyRowId ?? null,
      lead_id: lead_id ?? null,
      name: file.name,
      url: path,
      uploaded_by: admin ? "admin" : "attorney",
    })
    .select()
    .single();

  if (dbError) {
    await supabaseAdmin.storage.from("documents").remove([path]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
