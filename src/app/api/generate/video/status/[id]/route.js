import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { videoProvider } from "@/lib/providers";

// The client polls this endpoint every few seconds for a queued/processing video.
// It re-checks WaveSpeed only while the job is still open, then caches the result.
export async function GET(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const gen = await db.generation.findFirst({
    where: { id: params.id, userId },
  });
  if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Terminal states are cached — no need to hit the provider again.
  if (gen.status === "completed" || gen.status === "failed") {
    return NextResponse.json({ generation: gen });
  }

  if (!gen.providerJobId) {
    return NextResponse.json({ generation: gen });
  }

  try {
    const status = await videoProvider.getVideoStatus(gen.model, gen.providerJobId);
    if (status.status === "completed") {
      const updated = await db.generation.update({
        where: { id: gen.id },
        data: { status: "completed", resultUrl: status.resultUrl },
      });
      return NextResponse.json({ generation: updated });
    }
    if (status.status === "failed") {
      const updated = await db.generation.update({
        where: { id: gen.id },
        data: { status: "failed", error: status.error ?? "Generation failed" },
      });
      return NextResponse.json({ generation: updated });
    }
    return NextResponse.json({ generation: gen }); // still processing
  } catch (err) {
    // Transient provider error — keep the job open, let the client retry.
    return NextResponse.json({ generation: gen, transientError: true });
  }
}
