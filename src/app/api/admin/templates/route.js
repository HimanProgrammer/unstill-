import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const schema = z.object({
  label: z.string().min(1).max(80),
  blurb: z.string().max(120).optional(),
  category: z.string().min(1).max(40),
  mode: z.enum(["image", "video"]),
  prompt: z.string().min(1).max(2000),
});

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const last = await db.template.findFirst({ orderBy: { order: "desc" } });
  const template = await db.template.create({
    data: { ...parsed.data, blurb: parsed.data.blurb ?? "", order: (last?.order ?? -1) + 1 },
  });
  return NextResponse.json({ template });
}
