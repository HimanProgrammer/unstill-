import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { videoProvider } from "@/lib/providers";
import { spendCredits, refundCredits, CREDIT_COST, InsufficientCreditsError } from "@/lib/credits";

export async function POST(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const scene = await db.scene.findFirst({
    where: { id: params.sceneId, projectId: params.id, project: { userId } },
  });
  if (!scene) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!scene.prompt?.trim()) return NextResponse.json({ error: "Scene needs a prompt" }, { status: 400 });

  const cost = CREDIT_COST.video;
  try {
    await spendCredits(userId, cost, "generation");
  } catch (e) {
    if (e instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
    }
    throw e;
  }

  await db.scene.update({
    where: { id: scene.id },
    data: { status: "queued", costCredits: cost, error: null, resultUrl: null },
  });

  try {
    const { providerJobId } = await videoProvider.submitVideo(scene.prompt, {
      model: scene.model,
      imageUrl: scene.refImageUrl ?? undefined,
      duration: scene.duration,
    });
    const updated = await db.scene.update({
      where: { id: scene.id },
      data: { status: "processing", providerJobId },
    });
    return NextResponse.json({ scene: updated });
  } catch (err) {
    await refundCredits(userId, cost, "generation_refund");
    const updated = await db.scene.update({
      where: { id: scene.id },
      data: { status: "failed", error: String(err?.message ?? err).slice(0, 500) },
    });
    return NextResponse.json({ scene: updated, error: "Video submission failed" }, { status: 502 });
  }
}
