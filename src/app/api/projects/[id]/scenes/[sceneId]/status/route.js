import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { videoProvider } from "@/lib/providers";

export async function GET(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const scene = await db.scene.findFirst({
    where: { id: params.sceneId, projectId: params.id, project: { userId } },
  });
  if (!scene) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (scene.status === "completed" || scene.status === "failed" || !scene.providerJobId) {
    return NextResponse.json({ scene });
  }

  try {
    const status = await videoProvider.getVideoStatus(scene.model, scene.providerJobId);
    if (status.status === "completed") {
      const updated = await db.scene.update({
        where: { id: scene.id },
        data: { status: "completed", resultUrl: status.resultUrl },
      });
      return NextResponse.json({ scene: updated });
    }
    if (status.status === "failed") {
      const updated = await db.scene.update({
        where: { id: scene.id },
        data: { status: "failed", error: status.error ?? "Generation failed" },
      });
      return NextResponse.json({ scene: updated });
    }
    return NextResponse.json({ scene });
  } catch {
    return NextResponse.json({ scene, transientError: true });
  }
}
