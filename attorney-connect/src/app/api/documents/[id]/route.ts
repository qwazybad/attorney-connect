import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAdmin(userId: string | null) {
  if (!userId) return false;
  const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return adminIds.includes(userId);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { data: doc } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Non-admin can only delete their own uploads
  if (!isAdmin(userId)) {
    const { data: attorney } = await supabaseAdmin
      .from("attorneys").select("id").eq("clerk_id", userId).maybeSingle();
    if (!attorney || doc.attorney_id !== attorney.id || doc.uploaded_by !== "attorney") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  await supabaseAdmin.storage.from("documents").remove([doc.url]);
  await supabaseAdmin.from("documents").delete().eq("id", id);

  return NextResponse.json({ success: true });
}
