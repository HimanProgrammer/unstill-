import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { wavespeedRunTool, TOOLS } from "@/lib/providers/wavespeed";
import { spendCredits, refundCredits, InsufficientCreditsError } from "@/lib/credits";

// Captions, Audio Enhancer, background removal, and rotoscope are free (all
// pennies at the provider); transcription and auto-edit cost a small flat amount.
const TOOL_COST = {
  transcribe: 3,
  captions: 0,
  "audio-enhance": 0,
  "auto-edit": 3,
  "bg-remove": 0,
  rotoscope: 0,
};

const schema = z.object({
  url: z.string().url(),
  prompt: z.string().max(2000).optional(), // auto-edit (required) and rotoscope (optional subject)
  preset: z.string().max(40).optional(),    // caption style, only used by captions
  position: z.enum(["top", "center", "bottom"]).optional(), // only used by captions
  backgroundImage: z.string().url().optional(), // only used by bg-remove
});

export async function POST(req, { params }) {
  const { tool } = params;
  if (!TOOLS[tool]) return NextResponse.json({ error: "Unknown tool" }, { status: 404 });

  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  if (tool === "auto-edit" && !parsed.data.prompt?.trim()) {
    return NextResponse.json({ error: "Describe the edit you want" }, { status: 400 });
  }

  const cost = TOOL_COST[tool] ?? 0;
  if (cost > 0) {
    try {
      await spendCredits(userId, cost, "generation");
    } catch (e) {
      if (e instanceof InsufficientCreditsError) {
        return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
      }
      throw e;
    }
  }

  const gen = await db.generation.create({
    data: {
      userId,
      type: tool,
      provider: "wavespeed",
      prompt: parsed.data.prompt ?? parsed.data.url,
      status: "processing",
      costCredits: cost,
    },
  });

  try {
    const { providerJobId } = await wavespeedRunTool(tool, parsed.data);
    const updated = await db.generation.update({ where: { id: gen.id }, data: { providerJobId } });
    return NextResponse.json({ generation: updated });
  } catch (err) {
    if (cost > 0) await refundCredits(userId, cost, "generation_refund");
    const updated = await db.generation.update({
      where: { id: gen.id },
      data: { status: "failed", error: String(err?.message ?? err).slice(0, 500) },
    });
    return NextResponse.json({ generation: updated, error: "Submission failed" }, { status: 502 });
  }
}
