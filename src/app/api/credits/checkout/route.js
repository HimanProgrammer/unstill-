import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireUserId } from "@/lib/session";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

// Map a plan id -> Stripe Price + how many credits it grants.
const PLANS = {
  starter: { price: process.env.STRIPE_PRICE_100_CREDITS, credits: 100 },
  pro: { price: process.env.STRIPE_PRICE_500_CREDITS, credits: 500 },
};

export async function POST(req) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { plan } = await req.json().catch(() => ({}));
  const selected = PLANS[plan];
  if (!selected?.price) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: selected.price, quantity: 1 }],
    customer_email: user.email,
    success_url: `${appUrl}/dashboard?purchase=success`,
    cancel_url: `${appUrl}/pricing?purchase=cancelled`,
    // Carried through to the webhook so we know who to credit and how much.
    metadata: { userId, credits: String(selected.credits) },
  });

  return NextResponse.json({ url: checkout.url });
}
