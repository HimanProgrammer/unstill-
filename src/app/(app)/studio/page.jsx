import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { ProjectList } from "@/components/ProjectList";

export default async function StudioPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const projects = await db.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { scenes: true } } },
  });

  return <ProjectList initialProjects={projects} />;
}
