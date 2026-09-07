import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const label = typeof body?.label === "string" ? body.label.trim().slice(0, 100) : null;
  const bonusCredits = Number.isFinite(body?.bonusCredits) ? Math.max(0, Math.min(500, body.bonusCredits)) : 30;

  const code = randomBytes(5).toString("hex"); // short, URL-friendly
  const invite = await db.invite.create({ data: { code, label: label || null, bonusCredits } });
  return NextResponse.json({ invite });
}
