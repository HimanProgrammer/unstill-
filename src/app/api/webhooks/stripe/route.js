import { NextResponse } from "next/server";
import Stripe from "stripe";
import { addCredits } from "@/lib/credits";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

// Stripe needs the raw request body to verify the signature, so this route
// must NOT parse JSON before verifying.
export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const payload = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const credits = Number(session.metadata?.credits ?? 0);

    if (userId && credits > 0) {
      // Idempotency: don't double-credit if Stripe retries the webhook.
      const already = await db.transaction.findFirst({
        where: { stripeSessionId: session.id },
      });
      if (!already) {
        await addCredits(userId, credits, "purchase", session.id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
