import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function GET(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const project = await db.project.findFirst({
    where: { id: params.id, userId },
    include: { scenes: { orderBy: { order: "asc" } } },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ project });
}

export async function PATCH(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const existing = await db.project.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const data = {};
  if (typeof body?.title === "string" && body.title.trim()) data.title = body.title.trim();

  const project = await db.project.update({ where: { id: params.id }, data });
  return NextResponse.json({ project });
}

export async function DELETE(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const existing = await db.project.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
