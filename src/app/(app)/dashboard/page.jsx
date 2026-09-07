import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { videoModels, imageModels } from "@/lib/providers";
import { Studio } from "@/components/Studio";

export default async function DashboardPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Create</h1>
      <p className="mt-1 text-sm text-mute">Text to image or text to video, one prompt at a time.</p>
      <Studio videoModels={videoModels} imageModels={imageModels} initialCredits={user.credits} />
    </div>
  );
}
