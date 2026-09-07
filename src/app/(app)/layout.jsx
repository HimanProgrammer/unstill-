import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { AppShell } from "@/components/AppShell";

export default async function AppLayout({ children }) {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, credits: true, role: true },
  });
  if (!user) redirect("/login");

  return <AppShell user={user}>{children}</AppShell>;
}
