import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { generateImage } from "@/lib/providers";

export const maxDuration = 120;

export async function POST(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const template = await db.template.findUnique({ where: { id: params.id } });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const model = process.env.WAVESPEED_API_KEY ? "z-image-turbo" : undefined;
  try {
    let result;
    for (let attempt = 0; ; attempt++) {
      try {
        ({ result } = await generateImage(model, template.prompt));
        break;
      } catch (err) {
        if (attempt >= 3 || !String(err?.message).includes("429")) throw err;
        await new Promise((r) => setTimeout(r, 4000 * (attempt + 1)));
      }
    }
    const updated = await db.template.update({
      where: { id: template.id },
      data: { previewUrl: result.url },
    });
    return NextResponse.json({ template: updated });
  } catch (err) {
    return NextResponse.json({ error: String(err?.message ?? err).slice(0, 200) }, { status: 502 });
  }
}
