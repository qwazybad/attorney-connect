import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// POST /api/attorney/photo — upload profile photo via service-role key
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const path = `${userId}/profile.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("attorney-photos")
    .upload(path, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage
    .from("attorney-photos")
    .getPublicUrl(path);

  // Also update the attorney record immediately — find row by clerk_id
  const { data: existing } = await supabaseAdmin
    .from("attorneys")
    .select("id")
    .eq("clerk_id", userId)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin.from("attorneys").update({ photo_url: data.publicUrl }).eq("id", existing.id);
  } else {
    await supabaseAdmin.from("attorneys").insert({ id: userId, clerk_id: userId, photo_url: data.publicUrl });
  }

  return NextResponse.json({ url: data.publicUrl });
}
