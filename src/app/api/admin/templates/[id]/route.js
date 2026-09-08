import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const data = {};
  for (const key of ["label", "blurb", "category", "mode", "prompt"]) {
    if (typeof body[key] === "string") data[key] = body[key];
  }
  if (typeof body.order === "number") data.order = body.order;

  const template = await db.template.update({ where: { id: params.id }, data }).catch(() => null);
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ template });
}

export async function DELETE(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.template.delete({ where: { id: params.id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
