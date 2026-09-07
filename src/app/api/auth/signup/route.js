import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { redeemInviteForUser } from "@/lib/invites";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
  inviteCode: z.string().optional(),
});

export async function POST(req) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { email, password, name, inviteCode } = parsed.data;
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: { email, name, passwordHash, credits: 20 },
  });
  await db.transaction.create({
    data: { userId: user.id, credits: 20, reason: "signup_bonus" },
  });

  if (inviteCode) await redeemInviteForUser(inviteCode, user.id).catch(() => {});

  return NextResponse.json({ ok: true });
}
