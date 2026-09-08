import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public read — Studio/Create fetch these to render the template row.
export async function GET(req) {
  const mode = new URL(req.url).searchParams.get("mode");
  const templates = await db.template.findMany({
    where: mode ? { mode } : undefined,
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ templates });
}
