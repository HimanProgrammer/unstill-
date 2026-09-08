"use client";

import { useState } from "react";

const EMPTY = { label: "", blurb: "", category: "Cinematic", mode: "video", prompt: "" };

export function TemplateManager({ initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");

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

      <div className="mt-4 flex gap-2">
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
      </div>

      <div className="card mt-3 overflow-x-auto p-0">
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
