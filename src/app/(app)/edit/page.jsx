import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { ToolsPanel } from "@/components/ToolsPanel";

export default async function EditPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const user = await db.user.findUnique({ where: { id: userId }, select: { credits: true } });
  return <ToolsPanel initialCredits={user?.credits ?? 0} />;
}
