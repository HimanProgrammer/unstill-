import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { videoProvider } from "@/lib/providers";
import { getModel, DEFAULT_VIDEO_MODEL } from "@/lib/providers/catalog";
import { spendCredits, refundCredits, CREDIT_COST, InsufficientCreditsError } from "@/lib/credits";

const schema = z.object({
  prompt: z.string().min(1).max(2000),
  model: z.string().optional(),
  imageUrl: z.string().url().optional(),
  duration: z.number().int().min(1).max(20).optional(),
});

export async function POST(req) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const model = (parsed.data.model && getModel(parsed.data.model)?.type === "video"
    ? getModel(parsed.data.model)
    : getModel(DEFAULT_VIDEO_MODEL));
  const cost = CREDIT_COST.video;

  try {
    await spendCredits(userId, cost, "generation");
  } catch (e) {
    if (e instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
    }
    throw e;
  }

  const gen = await db.generation.create({
    data: {
      userId,
      type: "video",
      provider: model.provider,
      model: model.id,
      prompt: parsed.data.prompt,
      status: "queued",
      costCredits: cost,
    },
  });

  try {
    const { providerJobId } = await videoProvider.submitVideo(parsed.data.prompt, {
      model: model.id,
      imageUrl: parsed.data.imageUrl,
      duration: parsed.data.duration,
    });
    const updated = await db.generation.update({
      where: { id: gen.id },
      data: { status: "processing", providerJobId },
    });
    return NextResponse.json({ generation: updated });
  } catch (err) {
    await refundCredits(userId, cost, "generation_refund");
    await db.generation.update({
      where: { id: gen.id },
      data: { status: "failed", error: String(err?.message ?? err).slice(0, 500) },
    });
    return NextResponse.json({ error: "Video submission failed" }, { status: 502 });
  }
}
