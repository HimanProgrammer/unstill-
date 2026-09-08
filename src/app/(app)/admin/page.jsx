import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { InviteManager } from "@/components/InviteManager";
import { TemplateManager } from "@/components/TemplateManager";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const [users, generations, totals, invites, feedback, templates] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, name: true, email: true, role: true, credits: true, isBetaTester: true, createdAt: true },
    }),
    db.generation.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { email: true } } },
    }),
    db.user.aggregate({ _count: { _all: true } }),
    db.invite.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { redeemedBy: { select: { email: true } } },
    }),
    db.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { email: true } } },
    }),
    db.template.findMany({ orderBy: { order: "asc" } }),
  ]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl">Admin</h1>
            <p className="mt-1 text-sm text-mute">{totals._count._all} total users</p>
          </div>
          <Link href="/" target="_blank" className="btn-ghost text-sm">
            View website ↗
          </Link>
        </div>

        <section>
          <h2 className="mb-1 font-display text-lg">Beta testing</h2>
          <p className="mb-3 text-sm text-mute">
            Generate a link to share with friends & family — redeeming it grants bonus credits and marks them as a beta tester.
          </p>
          <InviteManager initialInvites={invites} appUrl={appUrl} />
        </section>

        <section>
          <h2 className="mb-1 font-display text-lg">Templates</h2>
          <p className="mb-3 text-sm text-mute">
            The "start from a template" library in Studio and Create — add, edit, or remove without a deploy.
          </p>
          <TemplateManager initialTemplates={templates} />
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg">Feedback</h2>
          <div className="card overflow-x-auto p-0">
            {feedback.length === 0 ? (
              <p className="p-6 text-center text-sm text-mute">No feedback submitted yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-mute">
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Message</th>
                    <th className="px-4 py-2">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((f) => (
                    <tr key={f.id} className="border-b border-white/5 align-top">
                      <td className="px-4 py-2 text-mute">{f.user?.email ?? "—"}</td>
                      <td className="px-4 py-2">{f.message}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-mute">{new Date(f.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg">Users</h2>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="text-mute">
                <tr className="border-b border-white/10">
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Beta</th>
                  <th className="px-4 py-2">Credits</th>
                  <th className="px-4 py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5">
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 text-mute">{u.name ?? "—"}</td>
                    <td className="px-4 py-2">
                      {u.role === "admin" ? (
                        <span className="text-amber">admin</span>
                      ) : (
                        <span className="text-mute">user</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{u.isBetaTester ? <span className="text-cyan">yes</span> : <span className="text-mute">—</span>}</td>
                    <td className="px-4 py-2 font-mono">{u.credits}</td>
                    <td className="px-4 py-2 text-mute">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg">Recent generations</h2>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="text-mute">
                <tr className="border-b border-white/10">
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Provider</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Cost</th>
                  <th className="px-4 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {generations.map((g) => (
                  <tr key={g.id} className="border-b border-white/5">
                    <td className="px-4 py-2">{g.user?.email ?? "—"}</td>
                    <td className="px-4 py-2 text-mute">{g.type}</td>
                    <td className="px-4 py-2 text-mute">{g.provider}</td>
                    <td className="px-4 py-2">{g.status}</td>
                    <td className="px-4 py-2 font-mono">{g.costCredits}</td>
                    <td className="px-4 py-2 text-mute">{new Date(g.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
    </div>
  );
}
