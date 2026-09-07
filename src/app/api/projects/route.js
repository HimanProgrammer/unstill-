import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const projects = await db.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { scenes: true } } },
  });
  return NextResponse.json({ projects });
}

export async function POST(req) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" && body.title.trim() ? body.title.trim() : "Untitled project";

  const project = await db.project.create({ data: { userId, title } });
  return NextResponse.json({ project });
}
