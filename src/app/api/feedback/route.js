import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";

const schema = z.object({ message: z.string().min(1).max(2000) });

export async function POST(req) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const feedback = await db.feedback.create({
    data: { userId, message: parsed.data.message.trim() },
  });
  return NextResponse.json({ feedback });
}
