import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";

async function ownedScene(userId, projectId, sceneId) {
  return db.scene.findFirst({
    where: { id: sceneId, projectId, project: { userId } },
  });
}

export async function PATCH(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const existing = await ownedScene(userId, params.id, params.sceneId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const data = {};
  if (typeof body?.prompt === "string") data.prompt = body.prompt.slice(0, 2000);
  if (typeof body?.model === "string") data.model = body.model;
  if (typeof body?.duration === "number") data.duration = body.duration;
  if (typeof body?.refImageUrl === "string") data.refImageUrl = body.refImageUrl.trim() || null;
  if (typeof body?.order === "number") data.order = body.order;

  const scene = await db.scene.update({ where: { id: params.sceneId }, data });
  return NextResponse.json({ scene });
}

export async function DELETE(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const existing = await ownedScene(userId, params.id, params.sceneId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.scene.delete({ where: { id: params.sceneId } });
  return NextResponse.json({ ok: true });
}
