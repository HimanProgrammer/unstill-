"use client";

import { useState } from "react";

const EMPTY = { label: "", blurb: "", category: "Cinematic", mode: "video", prompt: "" };

export function TemplateManager({ initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [previewBusy, setPreviewBusy] = useState({});
  const [previewError, setPreviewError] = useState(null);

  const visible = filter === "all" ? templates : templates.filter((t) => t.mode === filter);

  function startEdit(t) {
    setEditingId(t.id);
    setForm({ label: t.label, blurb: t.blurb, category: t.category, mode: t.mode, prompt: t.prompt });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function save() {
    if (!form.label.trim() || !form.prompt.trim() || !form.category.trim()) return;
    setBusy(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/templates/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          setTemplates((list) => list.map((t) => (t.id === editingId ? data.template : t)));
          cancelEdit();
        }
      } else {
        const res = await fetch("/api/admin/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          setTemplates((list) => [...list, data.template]);
          setForm(EMPTY);
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function generatePreview(id) {
    setPreviewBusy((s) => ({ ...s, [id]: true }));
    setPreviewError(null);
    try {
      const res = await fetch(`/api/admin/templates/${id}/preview`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTemplates((list) => list.map((t) => (t.id === id ? data.template : t)));
      } else {
        setPreviewError(data.error ?? "Preview generation failed");
      }
    } finally {
      setPreviewBusy((s) => ({ ...s, [id]: false }));
    }
  }

  async function generateMissing() {
    const missing = visible.filter((t) => !t.previewUrl);
    for (const t of missing) await generatePreview(t.id);
  }

  async function remove(id) {
    setTemplates((list) => list.filter((t) => t.id !== id));
    if (editingId === id) cancelEdit();
    await fetch(`/api/admin/templates/${id}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <div>
      <div className="card p-5">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-mute">
          {editingId ? "Edit template" : "Add a template"}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="field text-sm"
            placeholder="Label — e.g. Cinematic drone reveal"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          />
          <input
            className="field text-sm"
            placeholder="Blurb — short one-liner shown under the label"
            value={form.blurb}
            onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))}
          />
          <input
            className="field text-sm"
            placeholder="Category — e.g. Cinematic, Product, Food…"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
          <select
            className="field text-sm"
            value={form.mode}
            onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}
          >
            <option value="video">Video</option>
            <option value="image">Image</option>
          </select>
        </div>
        <textarea
          className="field mt-3 min-h-[70px] resize-y text-sm"
          placeholder="Full prompt used when this template is picked"
          value={form.prompt}
          onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
        />
        <div className="mt-3 flex gap-2">
          <button className="btn-amber py-2 text-sm" onClick={save} disabled={busy}>
            {busy ? "Saving…" : editingId ? "Save changes" : "+ Add template"}
          </button>
          {editingId && (
            <button className="text-sm text-mute hover:text-paper" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {["all", "video", "image"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
              filter === f ? "bg-amber text-ink" : "border border-white/10 text-mute hover:text-paper"
            }`}
          >
            {f} {f !== "all" && `(${templates.filter((t) => t.mode === f).length})`}
          </button>
        ))}
        {view === "grid" && visible.some((t) => !t.previewUrl) && (
          <button
            onClick={generateMissing}
            disabled={Object.values(previewBusy).some(Boolean)}
            className="ml-2 rounded-full border border-amber/40 px-3 py-1 text-xs text-amber hover:bg-amber/10 disabled:opacity-50"
          >
            Generate missing previews ({visible.filter((t) => !t.previewUrl).length})
          </button>
        )}
        <div className="ml-auto flex overflow-hidden rounded-full border border-white/10 text-xs">
          {["grid", "list"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 capitalize transition-colors ${
                view === v ? "bg-white/10 text-paper" : "text-mute hover:text-paper"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {previewError && <p className="mt-2 text-xs text-bad">{previewError}</p>}

      {view === "grid" && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((t) => (
            <div key={t.id} className="card flex flex-col overflow-hidden p-0">
              <div
                className={`relative flex aspect-video items-center justify-center ${
                  t.mode === "video"
                    ? "bg-gradient-to-br from-amber/25 via-white/5 to-transparent"
                    : "bg-gradient-to-br from-sky-400/20 via-white/5 to-transparent"
                }`}
              >
                {t.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.previewUrl} alt={t.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                ) : t.mode === "video" ? (
                  <svg viewBox="0 0 24 24" className="h-10 w-10 text-paper/70" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-10 w-10 text-paper/70" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="1.5" />
                    <path d="M21 16l-5-5-8 8" />
                  </svg>
                )}
                {previewBusy[t.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-paper">
                    Generating…
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-paper">
                  {t.mode}
                </span>
                <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-mute">
                  {t.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="text-sm font-medium">{t.label}</p>
                {t.blurb && <p className="mt-0.5 text-xs text-mute">{t.blurb}</p>}
                <p className="mt-2 line-clamp-3 text-xs text-mute/80" title={t.prompt}>{t.prompt}</p>
                <div className="mt-auto flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => generatePreview(t.id)}
                    disabled={previewBusy[t.id]}
                    className="mr-auto text-xs text-amber hover:opacity-80 disabled:opacity-50"
                  >
                    {t.previewUrl ? "Regenerate" : "Generate image"}
                  </button>
                  <button onClick={() => startEdit(t)} className="text-xs text-mute hover:text-paper">Edit</button>
                  <button onClick={() => remove(t.id)} className="text-xs text-mute hover:text-bad">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`card mt-3 overflow-x-auto p-0 ${view === "grid" ? "hidden" : ""}`}>
        <table className="w-full text-left text-sm">
          <thead className="text-mute">
            <tr className="border-b border-white/10">
              <th className="px-4 py-2">Label</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Mode</th>
              <th className="px-4 py-2">Prompt</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.id} className="border-b border-white/5 align-top">
                <td className="px-4 py-2">{t.label}</td>
                <td className="px-4 py-2 text-mute">{t.category}</td>
                <td className="px-4 py-2 text-mute">{t.mode}</td>
                <td className="max-w-xs truncate px-4 py-2 text-mute" title={t.prompt}>{t.prompt}</td>
                <td className="whitespace-nowrap px-4 py-2 text-right">
                  <button onClick={() => startEdit(t)} className="mr-3 text-xs text-mute hover:text-paper">Edit</button>
                  <button onClick={() => remove(t.id)} className="text-xs text-mute hover:text-bad">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
