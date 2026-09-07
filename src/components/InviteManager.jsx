"use client";

import { useState } from "react";

export function InviteManager({ initialInvites, appUrl }) {
  const [invites, setInvites] = useState(initialInvites);
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  async function createInvite() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim() || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setInvites((list) => [data.invite, ...list]);
        setLabel("");
      }
    } finally {
      setBusy(false);
    }
  }

  async function revokeInvite(id) {
    setInvites((list) => list.filter((i) => i.id !== id));
    await fetch(`/api/admin/invites/${id}`, { method: "DELETE" }).catch(() => {});
  }

  function inviteLink(code) {
    return `${appUrl}/login?invite=${code}`;
  }

  async function copyLink(invite) {
    try {
      await navigator.clipboard.writeText(inviteLink(invite.code));
      setCopiedId(invite.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* clipboard unavailable — link is still visible to copy manually */
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="field max-w-xs text-sm"
          placeholder={'Label (e.g. "For Priya") — optional'}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button className="btn-amber py-2 text-sm" onClick={createInvite} disabled={busy}>
          {busy ? "Creating…" : "+ Generate invite link"}
        </button>
      </div>

      <div className="card mt-4 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="text-mute">
            <tr className="border-b border-white/10">
              <th className="px-4 py-2">Label</th>
              <th className="px-4 py-2">Link</th>
              <th className="px-4 py-2">Bonus</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {invites.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-mute">No invites yet.</td></tr>
            )}
            {invites.map((inv) => (
              <tr key={inv.id} className="border-b border-white/5">
                <td className="px-4 py-2 text-mute">{inv.label ?? "—"}</td>
                <td className="px-4 py-2">
                  {inv.redeemedAt ? (
                    <span className="text-mute">—</span>
                  ) : (
                    <button onClick={() => copyLink(inv)} className="font-mono text-xs text-amber underline">
                      {copiedId === inv.id ? "Copied!" : "Copy link"}
                    </button>
                  )}
                </td>
                <td className="px-4 py-2 font-mono">{inv.bonusCredits}</td>
                <td className="px-4 py-2">
                  {inv.redeemedAt ? (
                    <span className="text-okay">Redeemed{inv.redeemedBy ? ` by ${inv.redeemedBy.email}` : ""}</span>
                  ) : (
                    <span className="text-mute">Unredeemed</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  {!inv.redeemedAt && (
                    <button onClick={() => revokeInvite(inv.id)} className="text-xs text-mute hover:text-bad">
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
