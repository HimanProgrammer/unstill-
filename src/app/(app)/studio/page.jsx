import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { ProjectList } from "@/components/ProjectList";

export default async function StudioPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const [projects, templates] = await Promise.all([
    db.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { scenes: true } } },
    }),
    db.template.findMany({ where: { mode: "video" }, orderBy: { order: "asc" } }),
  ]);

  return <ProjectList initialProjects={projects} initialTemplates={templates} />;
}
