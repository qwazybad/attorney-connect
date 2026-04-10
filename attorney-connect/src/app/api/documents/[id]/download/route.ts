import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAdmin(userId: string | null) {
  if (!userId) return false;
  const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return adminIds.includes(userId);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { data: doc } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Non-admin: verify ownership
  if (!isAdmin(userId)) {
    const { data: attorney } = await supabaseAdmin
      .from("attorneys").select("id").eq("clerk_id", userId).maybeSingle();
    if (!attorney || doc.attorney_id !== attorney.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(doc.url, 60 * 60); // 1 hour

  if (error || !data) return NextResponse.json({ error: "Could not generate download link" }, { status: 500 });

  return NextResponse.redirect(data.signedUrl);
}
