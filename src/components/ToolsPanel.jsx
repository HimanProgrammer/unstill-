"use client";

import { useCallback, useRef, useState } from "react";
import { Timeline, formatTime } from "@/components/Timeline";
import { ScriptToVideo } from "@/components/ScriptToVideo";
import { CAPTION_PRESETS } from "@/lib/captionPresets";
import { videoModels as initialVideoModels } from "@/lib/providers";

const TOOLS = [
  {
    id: "script-to-video",
    label: "Script to Scenes",
    blurb: "Upload a video, generate a script, parse into scenes, and create videos for each.",
    isSpecial: true,
    cost: 5,
  },
  {
    id: "transcribe",
    label: "Video → Text",
    blurb: "Transcribe the speech in a video into text.",
    urlPlaceholder: "https://…/interview.mp4",
    accept: "video/*",
    mediaType: "video",
    needsPrompt: false,
    cost: 3,
  },
  {
    id: "captions",
    label: "Add Captions",
    blurb: "Burn auto-generated subtitles onto a video, in whatever style you pick.",
    urlPlaceholder: "https://…/clip.mp4",
    accept: "video/*",
    mediaType: "video",
    needsPrompt: false,
    cost: 0,
  },
  {
    id: "audio-enhance",
    label: "Audio Enhancer",
    blurb: "Isolate and clean up the vocal/speech track from noisy audio.",
    urlPlaceholder: "https://…/audio.mp3",
    accept: "audio/*",
    mediaType: "audio",
    needsPrompt: false,
    cost: 0,
  },
  {
    id: "auto-edit",
    label: "Auto Video Edit",
    blurb: "Mark a range on the timeline (optional), describe an edit, and apply it.",
    urlPlaceholder: "https://…/source.mp4",
    accept: "video/*,.prproj,.aep,.mogrt",
    mediaType: "video",
    needsPrompt: true,
    allowTrim: true,
    cost: 3,
    note: "Premiere (.prproj) and After Effects (.aep/.mogrt) project files can be uploaded and attached, but aren't parsed — only exported video files (.mp4/.mov) can actually be previewed and edited here.",
  },
  {
    id: "bg-remove",
    label: "Remove Background",
    blurb: "One-click background / green-screen removal — optionally onto a new backdrop.",
    urlPlaceholder: "https://…/greenscreen.mp4",
    accept: "video/*",
    mediaType: "video",
    needsPrompt: false,
    cost: 0,
  },
  {
    id: "rotoscope",
    label: "Rotoscope",
    blurb: "Isolate and mask a subject across every frame automatically — just name what to track.",
    urlPlaceholder: "https://…/clip.mp4",
    accept: "video/*",
    mediaType: "video",
    needsPrompt: false,
    cost: 0,
  },
];

export function ToolsPanel({ initialCredits }) {
  const [active, setActive] = useState(TOOLS[0].id);
  const [credits, setCredits] = useState(initialCredits);
  const [jobs, setJobs] = useState({}); // toolId -> { url, prompt, generation, error, busy, uploading, fileName, trim, preset, position }
  const pollTimers = useRef({});

  const tool = TOOLS.find((t) => t.id === active);
  const job = jobs[active] ?? {};
  const cost = tool.cost;

  function setJob(id, patch) {
    setJobs((j) => ({ ...j, [id]: { ...j[id], ...patch } }));
  }

  const poll = useCallback((toolId, genId) => {
    pollTimers.current[toolId] = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tools/${toolId}/status/${genId}`);
        const data = await res.json();
        if (data.generation) setJob(toolId, { generation: data.generation });
        if (data.generation && (data.generation.status === "queued" || data.generation.status === "processing")) {
          poll(toolId, genId);
        } else {
          setJob(toolId, { busy: false });
        }
      } catch {
        poll(toolId, genId);
      }
    }, 4000);
  }, []);

  async function uploadFile(file) {
    setJob(active, { uploading: true, error: "", fileName: file.name });
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/tools/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setJob(active, { uploading: false, error: data.error ?? "Upload failed", fileName: null });
        return;
      }
      const isProjectFile = /\.(prproj|aep|mogrt)$/i.test(file.name);
      setJob(active, { uploading: false, url: data.url, isProjectFile });
    } catch {
      setJob(active, { uploading: false, error: "Upload failed. Try again.", fileName: null });
    }
  }

  async function run() {
    if (!job.url?.trim()) return;
    if (tool.needsPrompt && !job.prompt?.trim()) return;
    if (credits < cost) return;

    setJob(active, { busy: true, error: "", generation: null });
    if (cost > 0) setCredits((c) => c - cost);

    // The trim range isn't a real cut param on any provider we call — fold it
    // into the prompt as a hint so the model at least knows the intent.
    let prompt = job.prompt?.trim();
    if (tool.allowTrim && job.trim && (job.trim.start > 0.1 || job.trim.end < (job.duration ?? Infinity) - 0.1)) {
      prompt = `${prompt} (focus on roughly ${formatTime(job.trim.start)}–${formatTime(job.trim.end)} of the source clip)`;
    }

    try {
      const res = await fetch(`/api/tools/${active}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: job.url.trim(),
          prompt,
          preset: job.preset,
          position: job.position,
          backgroundImage: job.backgroundImage?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (cost > 0) setCredits((c) => c + cost);
        setJob(active, { busy: false, error: data.error ?? "Failed to start" });
        return;
      }
      setJob(active, { generation: data.generation });
      poll(active, data.generation.id);
    } catch {
      if (cost > 0) setCredits((c) => c + cost);
      setJob(active, { busy: false, error: "Network error. Try again." });
    }
  }

  // Special handling for script-to-video tool
  if (tool.isSpecial && tool.id === "script-to-video") {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium">Edit</h1>
          <span className="font-mono text-sm text-mute"><span className="text-amber">{credits}</span> credits</span>
        </div>
        <p className="mt-1 text-sm text-mute">Post-production tools — upload a file or paste a media URL, then run a tool on it.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                active === t.id ? "bg-amber text-ink" : "border border-white/10 text-mute hover:text-paper"
              }`}
            >
              {t.label}
              {t.cost === 0 && <span className="ml-1.5 text-[10px] text-okay">FREE</span>}
            </button>
          ))}
        </div>

        <div className="card mt-5 p-6">
          <ScriptToVideo videoModels={initialVideoModels} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium">Edit</h1>
        <span className="font-mono text-sm text-mute"><span className="text-amber">{credits}</span> credits</span>
      </div>
      <p className="mt-1 text-sm text-mute">Post-production tools — upload a file or paste a media URL, then run a tool on it.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              active === t.id ? "bg-amber text-ink" : "border border-white/10 text-mute hover:text-paper"
            }`}
          >
            {t.label}
            {t.cost === 0 && <span className="ml-1.5 text-[10px] text-okay">FREE</span>}
          </button>
        ))}
      </div>

      <div className="card mt-5 grid gap-6 p-6 md:grid-cols-2">
        <div>
          <p className="text-sm text-mute">{tool.blurb}</p>

          <label className="mb-1 mt-4 block text-sm text-mute">Upload a file</label>
          <label className="field flex cursor-pointer items-center justify-center gap-2 border-dashed py-4 text-center text-sm text-mute hover:border-iris/50">
            <input
              type="file"
              accept={tool.accept}
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
            />
            {job.uploading ? "Uploading…" : job.fileName ? `✓ ${job.fileName}` : "Click to choose a file"}
          </label>
          {tool.note && <p className="mt-1.5 text-xs text-mute">{tool.note}</p>}

          <div className="my-3 flex items-center gap-3 text-xs text-mute">
            <span className="h-px flex-1 bg-white/10" /> or paste a URL <span className="h-px flex-1 bg-white/10" />
          </div>

          <input
            className="field"
            value={job.url ?? ""}
            onChange={(e) => setJob(active, { url: e.target.value, fileName: null, isProjectFile: false })}
            placeholder={tool.urlPlaceholder}
          />

          {tool.id === "captions" && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm text-mute">Style</label>
                <select
                  className="field text-sm"
                  value={job.preset ?? "simple"}
                  onChange={(e) => setJob(active, { preset: e.target.value })}
                >
                  {CAPTION_PRESETS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-mute">Position</label>
                <select
                  className="field text-sm"
                  value={job.position ?? "bottom"}
                  onChange={(e) => setJob(active, { position: e.target.value })}
                >
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
          )}

          {tool.id === "rotoscope" && (
            <div className="mt-4">
              <label className="mb-1 block text-sm text-mute">Subject to isolate (optional)</label>
              <input
                className="field text-sm"
                value={job.prompt ?? ""}
                onChange={(e) => setJob(active, { prompt: e.target.value })}
                placeholder="person, car, dog… (comma-separate to track several)"
              />
            </div>
          )}

          {tool.id === "bg-remove" && (
            <div className="mt-4">
              <label className="mb-1 block text-sm text-mute">Replacement background image URL (optional)</label>
              <input
                className="field text-sm"
                value={job.backgroundImage ?? ""}
                onChange={(e) => setJob(active, { backgroundImage: e.target.value })}
                placeholder="Leave blank to just remove the background"
              />
            </div>
          )}

          {tool.needsPrompt && (
            <>
              <label className="mb-1 mt-4 block text-sm text-mute">Describe the edit</label>
              <textarea
                className="field min-h-[80px] resize-y"
                value={job.prompt ?? ""}
                onChange={(e) => setJob(active, { prompt: e.target.value })}
                placeholder="Make the sky look like a sunset, add gentle snowfall…"
              />
            </>
          )}

          <button
            className="btn-amber mt-5 w-full"
            disabled={job.busy || job.uploading || !job.url?.trim() || (tool.needsPrompt && !job.prompt?.trim()) || credits < cost}
            onClick={run}
          >
            {job.busy ? "Processing…" : cost > 0 ? `Run — ${cost} credits` : "Run — free"}
          </button>
          {credits < cost && <p className="mt-2 text-xs text-warn">Not enough credits.</p>}
          {job.error && <p className="mt-2 text-xs text-bad">{job.error}</p>}
        </div>

        <div className="flex min-h-[220px] flex-col justify-center gap-4 rounded-md bg-ink p-4">
          {job.isProjectFile ? (
            <p className="text-center text-sm text-mute">
              📎 {job.fileName} attached — project files aren't previewable here.
            </p>
          ) : job.url && !job.generation ? (
            <Timeline
              src={job.url}
              type={tool.mediaType}
              allowTrim={tool.allowTrim}
              onTrimChange={(t) => setJob(active, { trim: t })}
            />
          ) : (
            <ToolResult job={job} />
          )}
        </div>
      </div>
    </div>
  );
}

function ToolResult({ job }) {
  const gen = job.generation;
  if (!gen && !job.busy) {
    return <p className="text-center text-sm text-mute">Upload or paste a link to preview it here.</p>;
  }
  if (gen?.status === "completed") {
    if (gen.resultText) {
      return (
        <div className="max-h-[300px] w-full overflow-y-auto whitespace-pre-wrap rounded-md bg-white/[0.03] p-4 text-sm text-paper">
          {gen.resultText}
        </div>
      );
    }
    if (gen.resultUrl) {
      const isAudio = /\.(mp3|wav|m4a|ogg)(\?|$)/i.test(gen.resultUrl);
      return isAudio ? (
        <audio src={gen.resultUrl} controls className="w-full" />
      ) : (
        <video src={gen.resultUrl} controls className="max-h-[280px] w-full rounded" />
      );
    }
  }
  if (gen?.status === "failed") {
    return <p className="text-center text-sm text-bad">{gen.error ?? "Job failed."}</p>;
  }
  return (
    <div className="text-center">
      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-rail border-t-amber" />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-mute">Processing…</p>
    </div>
  );
}
