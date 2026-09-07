import { db } from "@/lib/db";

export const DAILY_BONUS_CREDITS = 5;

// Grants a small credit bonus once per calendar day, on sign-in. Returns the
// bonus amount if granted this call, or null if already claimed today.
export async function grantDailyBonusIfDue(userId) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { lastDailyBonusAt: true } });
  if (!user) return null;

  const today = new Date().toDateString();
  const last = user.lastDailyBonusAt ? new Date(user.lastDailyBonusAt).toDateString() : null;
  if (last === today) return null;

  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { credits: { increment: DAILY_BONUS_CREDITS }, lastDailyBonusAt: new Date() },
    }),
    db.transaction.create({
      data: { userId, credits: DAILY_BONUS_CREDITS, reason: "daily_login_bonus" },
    }),
  ]);
  return DAILY_BONUS_CREDITS;
}
