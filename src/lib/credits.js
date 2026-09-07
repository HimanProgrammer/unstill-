import { db } from "@/lib/db";

// Credit cost per generation. Tune to your real WaveSpeedAI + OpenAI costs + margin.
export const CREDIT_COST = {
  image: 1,   // image generation
  video: 10,  // WaveSpeedAI video job (adjust per model/duration if needed)
};

export class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits");
    this.name = "InsufficientCreditsError";
  }
}

/** Atomically deduct credits and log a transaction. Throws if balance too low.
 *  Admins (role "admin") skip the deduction entirely — unlimited credits. */
export async function spendCredits(userId, amount, reason) {
  return db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new InsufficientCreditsError();
    if (user.role === "admin") return user.credits;
    if (user.credits < amount) throw new InsufficientCreditsError();

    const updated = await tx.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
    });
    await tx.transaction.create({ data: { userId, credits: -amount, reason } });
    return updated.credits;
  });
}

/** Give credits back if a generation fails after we already charged. */
export async function refundCredits(userId, amount, reason) {
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { credits: { increment: amount } } }),
    db.transaction.create({ data: { userId, credits: amount, reason } }),
  ]);
}

export async function addCredits(userId, amount, reason, stripeSessionId) {
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { credits: { increment: amount } } }),
    db.transaction.create({ data: { userId, credits: amount, reason, stripeSessionId } }),
  ]);
}
