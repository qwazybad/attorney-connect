import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { customerId, paymentMethodId } = await req.json();
  if (!customerId || !paymentMethodId) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("attorneys")
    .update({
      stripe_customer_id: customerId,
      stripe_payment_method_id: paymentMethodId,
      founding_member: true,
    })
    .eq("clerk_id", userId);

  if (error) {
    console.error("Supabase update error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
