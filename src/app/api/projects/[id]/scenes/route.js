import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { DEFAULT_VIDEO_MODEL } from "@/lib/providers/catalog";

export async function POST(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const project = await db.project.findFirst({ where: { id: params.id, userId } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const last = await db.scene.findFirst({
    where: { projectId: project.id },
    orderBy: { order: "desc" },
  });

  const scene = await db.scene.create({
    data: {
      projectId: project.id,
      order: (last?.order ?? -1) + 1,
      model: DEFAULT_VIDEO_MODEL,
      duration: 5,
    },
  });
  await db.project.update({ where: { id: project.id }, data: { updatedAt: new Date() } });

  return NextResponse.json({ scene });
}
