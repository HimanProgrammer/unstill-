import { redirect, notFound } from "next/navigation";
import { requireUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { videoModels } from "@/lib/providers";
import { SceneEditor } from "@/components/SceneEditor";

export default async function ProjectPage({ params }) {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const [project, user] = await Promise.all([
    db.project.findFirst({
      where: { id: params.id, userId },
      include: { scenes: { orderBy: { order: "asc" } } },
    }),
    db.user.findUnique({ where: { id: userId }, select: { credits: true } }),
  ]);
  if (!project) notFound();

  return <SceneEditor project={project} videoModels={videoModels} initialCredits={user?.credits ?? 0} />;
}
