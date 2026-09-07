import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { wavespeedUploadFile } from "@/lib/providers/wavespeed";

const MAX_BYTES = 100 * 1024 * 1024; // 100MB — generous but bounded

export async function POST(req) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await wavespeedUploadFile(buffer, file.name || "upload", file.type || "application/octet-stream");
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: String(err?.message ?? err).slice(0, 300) }, { status: 502 });
  }
}
