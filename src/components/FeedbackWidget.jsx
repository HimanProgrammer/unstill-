"use client";

import { useState } from "react";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function send() {
    if (!message.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      if (res.ok) {
        setSent(true);
        setMessage("");
        setTimeout(() => { setSent(false); setOpen(false); }, 1500);
      }
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-md px-3 py-2 text-left text-xs text-mute hover:bg-white/[0.04] hover:text-paper"
      >
        💬 Send feedback
      </button>
    );
  }

  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      {sent ? (
        <p className="text-center text-xs text-okay">Thanks — got it!</p>
      ) : (
        <>
          <textarea
            className="field min-h-[70px] resize-none text-xs"
            placeholder="What's working, what's broken, what you'd like to see…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoFocus
          />
          <div className="mt-2 flex gap-2">
            <button className="btn-amber flex-1 py-1.5 text-xs" onClick={send} disabled={busy || !message.trim()}>
              {busy ? "Sending…" : "Send"}
            </button>
            <button className="text-xs text-mute hover:text-paper" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
