import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  return user?.role === "admin" ? user : null;
}
