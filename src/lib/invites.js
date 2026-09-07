import { db } from "@/lib/db";

// Redeems a beta invite code for a user: single-use, marks the user as a
// beta tester, and grants the invite's credit bonus. Returns the redeemed
// invite, or null if the code is missing/unknown/already used.
export async function redeemInviteForUser(code, userId) {
  if (!code) return null;
  const invite = await db.invite.findUnique({ where: { code } });
  if (!invite || invite.redeemedAt) return null;

  const [updatedInvite] = await db.$transaction([
    db.invite.update({ where: { id: invite.id }, data: { redeemedAt: new Date(), redeemedById: userId } }),
    db.user.update({
      where: { id: userId },
      data: { isBetaTester: true, credits: { increment: invite.bonusCredits } },
    }),
    db.transaction.create({
      data: { userId, credits: invite.bonusCredits, reason: "beta_invite_bonus" },
    }),
  ]);
  return updatedInvite;
}
