import { PrismaClient } from "@prisma/client";

// Standard Next.js singleton pattern so hot-reload in dev doesn't
// exhaust database connections.
const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
