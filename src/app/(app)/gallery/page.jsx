import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUserId } from "@/lib/session";
import { db } from "@/lib/db";

export default async function GalleryPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const generations = await db.generation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Gallery</h1>
      <p className="mt-1 text-sm text-mute">Everything you've generated, newest first.</p>

      {generations.length === 0 ? (
        <div className="card p-10 text-center text-mute">
          <p>Nothing here yet.</p>
          <Link href="/dashboard" className="mt-3 inline-block text-amber underline">
            Generate your first image or video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-16 sm:grid-cols-3 md:grid-cols-4">
          {generations.map((g) => (
            <div key={g.id} className="card overflow-hidden">
              <div className="flex aspect-square items-center justify-center bg-ink">
                {g.status === "completed" && g.resultUrl ? (
                  g.type === "video" ? (
                    <video src={g.resultUrl} className="h-full w-full object-cover" muted loop
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.resultUrl} alt={g.prompt} className="h-full w-full object-cover" />
                  )
                ) : (
                  <span className="font-mono text-xs uppercase tracking-widest text-mute">
                    {g.status}
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="line-clamp-2 text-xs text-mute" title={g.prompt}>{g.prompt}</p>
                <p className="mt-1 font-mono text-[10px] uppercase text-amber">
                  {g.type} · {g.provider}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
