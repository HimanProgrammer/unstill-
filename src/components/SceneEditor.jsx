"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TemplatePicker } from "@/components/TemplatePicker";

const STATUS_LABEL = {
  draft: "Not generated",
  queued: "Queued…",
  processing: "Rendering…",
  completed: "Done",
  failed: "Failed",
};

export function SceneEditor({ project, videoModels, initialCredits }) {
  const [title, setTitle] = useState(project.title);
  const [scenes, setScenes] = useState(project.scenes);
  const [credits, setCredits] = useState(initialCredits);
  const cost = 10;

  async function saveTitle() {
    if (title.trim() === project.title) return;
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() || "Untitled project" }),
    }).catch(() => {});
  }

  function patchSceneLocal(id, fields) {
    setScenes((list) => list.map((s) => (s.id === id ? { ...s, ...fields } : s)));
  }

  async function updateScene(id, fields) {
    patchSceneLocal(id, fields);
    await fetch(`/api/projects/${project.id}/scenes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    }).catch(() => {});
  }

  async function addScene() {
    const res = await fetch(`/api/projects/${project.id}/scenes`, { method: "POST" });
    const data = await res.json();
    if (res.ok) setScenes((list) => [...list, data.scene]);
  }

  async function deleteScene(id) {
    setScenes((list) => list.filter((s) => s.id !== id));
    await fetch(`/api/projects/${project.id}/scenes/${id}`, { method: "DELETE" }).catch(() => {});
  }

  async function moveScene(id, dir) {
    const idx = scenes.findIndex((s) => s.id === id);
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= scenes.length) return;
    const reordered = [...scenes];
    [reordered[idx], reordered[swapWith]] = [reordered[swapWith], reordered[idx]];
    setScenes(reordered);
    await Promise.all(
      reordered.map((s, i) =>
        fetch(`/api/projects/${project.id}/scenes/${s.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        }),
      ),
    ).catch(() => {});
  }

  const pollTimers = useRef({});

  const poll = useCallback((sceneId) => {
    pollTimers.current[sceneId] = setTimeout(async () => {
      try {
        const res = await fetch(`/api/projects/${project.id}/scenes/${sceneId}/status`);
        const data = await res.json();
        if (data.scene) patchSceneLocal(sceneId, data.scene);
        if (data.scene && (data.scene.status === "processing" || data.scene.status === "queued")) {
          poll(sceneId);
        }
      } catch {
        poll(sceneId);
      }
    }, 5000);
  }, [project.id]);

  useEffect(() => {
    // Resume polling for any scene still in flight when the page loads.
    scenes.forEach((s) => {
      if (s.status === "queued" || s.status === "processing") poll(s.id);
    });
    return () => Object.values(pollTimers.current).forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generateScene(scene) {
    if (!scene.prompt?.trim() || credits < cost) return;
    patchSceneLocal(scene.id, { status: "queued", error: null });
    setCredits((c) => c - cost);

    const res = await fetch(`/api/projects/${project.id}/scenes/${scene.id}/generate`, { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      setCredits((c) => c + cost); // refund locally too, server already refunded
      patchSceneLocal(scene.id, { status: "failed", error: data.error ?? "Generation failed" });
      return;
    }
    patchSceneLocal(scene.id, data.scene);
    poll(scene.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Link href="/studio" className="text-sm text-mute hover:text-paper">← All projects</Link>
        <span className="font-mono text-sm text-mute">
          <span className="text-amber">{credits}</span> credits
        </span>
      </div>

      <input
        className="mt-4 w-full bg-transparent font-display text-2xl font-medium outline-none focus:border-b focus:border-iris/50"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={saveTitle}
      />
      <p className="mt-1 text-sm text-mute">
        {scenes.length} scene{scenes.length === 1 ? "" : "s"} · {cost} credits per render
      </p>

      <div className="mt-6 space-y-4">
        {scenes.map((scene, i) => (
          <SceneCard
            key={scene.id}
            index={i}
            total={scenes.length}
            scene={scene}
            videoModels={videoModels}
            onChange={(fields) => updateScene(scene.id, fields)}
            onGenerate={() => generateScene(scene)}
            onDelete={() => deleteScene(scene.id)}
            onMove={(dir) => moveScene(scene.id, dir)}
            canGenerate={credits >= cost}
          />
        ))}
      </div>

      <button className="btn-ghost mt-6" onClick={addScene}>+ Add scene</button>

      {credits < cost && (
        <p className="mt-3 text-sm text-warn">
          Not enough credits to render. <Link href="/pricing" className="underline">Buy more</Link>.
        </p>
      )}
    </div>
  );
}

function SceneCard({ index, total, scene, videoModels, onChange, onGenerate, onDelete, onMove, canGenerate }) {
  const allowedDurations = videoModels.find((m) => m.id === scene.model)?.durations ?? [5, 8];
  const busy = scene.status === "queued" || scene.status === "processing";

  return (
    <div className="card grid gap-4 p-5 md:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-mute">Scene {index + 1}</span>
          <div className="flex items-center gap-2 text-xs text-mute">
            <TemplatePicker mode="video" label="Templates" onPick={(t) => onChange({ prompt: t.prompt })} />
            <button onClick={() => onMove(-1)} disabled={index === 0} className="disabled:opacity-30">↑</button>
            <button onClick={() => onMove(1)} disabled={index === total - 1} className="disabled:opacity-30">↓</button>
            <button onClick={onDelete} className="text-mute hover:text-bad">Delete</button>
          </div>
        </div>

        <textarea
          className="field min-h-[90px] resize-y"
          value={scene.prompt}
          onChange={(e) => onChange({ prompt: e.target.value })}
          placeholder="Describe this shot — camera move, subject, lighting…"
        />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-mute">Model</label>
            <select
              className="field text-sm"
              value={scene.model ?? videoModels[0]?.id}
              onChange={(e) => onChange({ model: e.target.value })}
            >
              {videoModels.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-mute">Duration</label>
            <select
              className="field text-sm"
              value={scene.duration}
              onChange={(e) => onChange({ duration: Number(e.target.value) })}
            >
              {allowedDurations.map((d) => (
                <option key={d} value={d}>{d}s</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-mute">Reference image (optional)</label>
          <input
            className="field text-sm"
            value={scene.refImageUrl ?? ""}
            onChange={(e) => onChange({ refImageUrl: e.target.value })}
            placeholder="https://…/still-frame.jpg"
          />
        </div>

        <button
          className="btn-amber mt-4 w-full"
          disabled={busy || !scene.prompt?.trim() || !canGenerate}
          onClick={onGenerate}
        >
          {busy ? "Rendering…" : `Generate scene — ${10} credits`}
        </button>
        {scene.error && <p className="mt-2 text-xs text-bad">{scene.error}</p>}
      </div>

      <div className="flex min-h-[180px] items-center justify-center rounded-md bg-ink">
        {scene.status === "completed" && scene.resultUrl ? (
          <video src={scene.resultUrl} controls className="max-h-[240px] w-full rounded" />
        ) : busy ? (
          <div className="text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-rail border-t-amber" />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-mute">
              {STATUS_LABEL[scene.status]}
            </p>
          </div>
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
            {STATUS_LABEL[scene.status] ?? "Not generated"}
          </p>
        )}
      </div>
    </div>
  );
}
