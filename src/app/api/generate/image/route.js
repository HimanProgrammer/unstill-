import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { generateImage } from "@/lib/providers";
import { spendCredits, refundCredits, CREDIT_COST, InsufficientCreditsError } from "@/lib/credits";

const schema = z.object({
  prompt: z.string().min(1).max(2000),
  size: z.enum(["1024x1024", "1024x1536", "1536x1024"]).optional(),
  model: z.string().optional(),
});

export async function POST(req) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const cost = CREDIT_COST.image;

  // Charge first so concurrent requests can't overspend; refund on failure.
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
      type: "image",
      provider: parsed.data.model ?? "gpt-image-1",
      prompt: parsed.data.prompt,
      status: "processing",
      costCredits: cost,
    },
  });

  try {
    const { result, provider } = await generateImage(parsed.data.model, parsed.data.prompt, {
      size: parsed.data.size,
    });
    const updated = await db.generation.update({
      where: { id: gen.id },
      data: { status: "completed", resultUrl: result.url, provider },
    });
    return NextResponse.json({ generation: updated });
  } catch (err) {
    await refundCredits(userId, cost, "generation_refund");
    await db.generation.update({
      where: { id: gen.id },
      data: { status: "failed", error: String(err?.message ?? err).slice(0, 500) },
    });
    return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
  }
}
