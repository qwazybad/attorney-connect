import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email } = await req.json();

  // Create a Stripe customer
  const customer = await stripe.customers.create({
    name,
    email,
    metadata: { clerk_id: userId },
  });

  // Create a SetupIntent — captures card details, charges $0
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
    payment_method_types: ["card"],
    metadata: { clerk_id: userId },
  });

  return Response.json({
    clientSecret: setupIntent.client_secret,
    customerId: customer.id,
  });
}
