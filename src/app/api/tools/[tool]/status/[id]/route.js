import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { wavespeedGetToolStatus } from "@/lib/providers/wavespeed";

export async function GET(req, { params }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const gen = await db.generation.findFirst({ where: { id: params.id, userId, type: params.tool } });
  if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (gen.status === "completed" || gen.status === "failed" || !gen.providerJobId) {
    return NextResponse.json({ generation: gen });
  }

  try {
    const status = await wavespeedGetToolStatus(gen.providerJobId);
    if (status.status === "completed") {
      const updated = await db.generation.update({
        where: { id: gen.id },
        data: { status: "completed", resultUrl: status.resultUrl ?? null, resultText: status.resultText ?? null },
      });
      return NextResponse.json({ generation: updated });
    }
    if (status.status === "failed") {
      const updated = await db.generation.update({
        where: { id: gen.id },
        data: { status: "failed", error: status.error ?? "Job failed" },
      });
      return NextResponse.json({ generation: updated });
    }
    return NextResponse.json({ generation: gen });
  } catch {
    return NextResponse.json({ generation: gen, transientError: true });
  }
}
