// One-time migration: copy the hardcoded TEMPLATES array into the DB-backed
// Template table so they become admin-editable. Safe to re-run — skips if
// the table already has rows.
import { PrismaClient } from "@prisma/client";
import { TEMPLATES } from "../src/lib/templates.js";

const db = new PrismaClient();

async function main() {
  const existing = await db.template.count();
  if (existing > 0) {
    console.log(`Template table already has ${existing} rows — skipping seed.`);
    return;
  }
  for (let i = 0; i < TEMPLATES.length; i++) {
    const t = TEMPLATES[i];
    await db.template.create({
      data: {
        label: t.label,
        blurb: t.blurb ?? "",
        category: t.category,
        mode: t.mode,
        prompt: t.prompt,
        order: i,
      },
    });
  }
  console.log(`Seeded ${TEMPLATES.length} templates.`);
}

main().finally(() => db.$disconnect());
