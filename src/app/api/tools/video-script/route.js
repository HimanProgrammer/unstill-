import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { generateScriptFromVideoUrl } from "@/lib/providers/openai";
import { spendCredits, refundCredits, CREDIT_COST, InsufficientCreditsError } from "@/lib/credits";

const schema = z.object({
  videoUrl: z.string().url("Valid video URL required"),
  prompt: z.string().max(500).optional(),
});

export async function POST(req) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const cost = CREDIT_COST.script;

  try {
    await spendCredits(userId, cost, "script_generation");
  } catch (e) {
    if (e instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
    }
    throw e;
  }

  const gen = await db.generation.create({
    data: {
      userId,
      type: "script",
      provider: "openai",
      model: "gpt-4o",
      prompt: parsed.data.prompt || parsed.data.videoUrl,
      status: "processing",
      costCredits: cost,
    },
  });

  try {
    const script = await generateScriptFromVideoUrl(parsed.data.videoUrl);

    const updated = await db.generation.update({
      where: { id: gen.id },
      data: {
        status: "completed",
        resultText: script,
      },
    });

    return NextResponse.json({ generation: updated });
  } catch (err) {
    await refundCredits(userId, cost, "script_generation_refund");
    await db.generation.update({
      where: { id: gen.id },
      data: {
        status: "failed",
        error: String(err?.message ?? err).slice(0, 500),
      },
    });
    return NextResponse.json(
      { error: "Script generation failed" },
      { status: 502 }
    );
  }
}
