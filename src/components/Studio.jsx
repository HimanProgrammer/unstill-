"use client";

import { useState, useRef, useCallback } from "react";
import { TemplatePicker } from "@/components/TemplatePicker";

const IMAGE_SIZES = ["1024x1024", "1536x1024", "1024x1536"];

export function Studio({ videoModels, imageModels, initialCredits }) {
  const [mode, setMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [model, setModel] = useState(videoModels.find((m) => m.isDefault)?.id ?? videoModels[0]?.id);
  const [imageModel, setImageModel] = useState(
    imageModels.find((m) => m.isDefault)?.id ?? imageModels[0]?.id,
  );
  const [duration, setDuration] = useState(5);
  const [refImageUrl, setRefImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [credits, setCredits] = useState(initialCredits);

  const [current, setCurrent] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pollTimer = useRef(null);

  const cost = mode === "image" ? 1 : mode === "video" ? 10 : 5;
  const canGenerate =
    ((mode === "script" && videoUrl.trim().length > 0) || (mode !== "script" && prompt.trim().length > 0))
    && !busy
    && credits >= cost;

  const pollVideo = useCallback((id) => {
    // Videos are async on PixVerse; poll every 5s until terminal.
    pollTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/generate/video/status/${id}`);
        const data = await res.json();
        const gen = data.generation;
        setCurrent(gen);
        if (gen.status === "processing" || gen.status === "queued") {
          pollVideo(id);
        } else {
          setBusy(false);
        }
      } catch {
        pollVideo(id); // transient — keep trying
      }
    }, 5000);
  }, []);

  async function generate() {
    setError("");
    setBusy(true);
    setCurrent(null);

    let endpoint = "/api/generate/image";
    let body = { prompt, size, model: imageModel };

    if (mode === "video") {
      endpoint = "/api/generate/video";
      body = { prompt, model, duration, imageUrl: refImageUrl.trim() || undefined };
    } else if (mode === "script") {
      endpoint = "/api/tools/video-script";
      body = { videoUrl: videoUrl.trim() };
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(res.status === 402 ? "You're out of credits." : data.error ?? "Generation failed");
        setBusy(false);
        return;
      }

      setCredits((c) => c - cost);
      const gen = data.generation;
      setCurrent(gen);

      if (mode === "video") {
        pollVideo(gen.id);
      } else {
        setBusy(false);
      }
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 py-8 lg:grid-cols-[380px_1fr]">
      {/* Control panel */}
      <div className="card h-fit p-5">
        {/* Mode toggle */}
        <div className="mb-5 grid grid-cols-3 gap-1 rounded border border-rail p-1">
          {[
            { id: "image", label: "Text to Image" },
            { id: "video", label: "Text to Video" },
            { id: "script", label: "Video Script" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded px-2 py-1.5 text-xs transition-colors ${
                mode === m.id ? "bg-amber text-ink" : "text-mute hover:text-paper"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "script" ? (
          <>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm text-mute">Video URL</label>
              <TemplatePicker mode={mode} onPick={(t) => setVideoUrl(t.prompt)} />
            </div>
            <input
              type="url"
              className="field"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
            />
            <p className="mt-1 text-xs text-mute">
              Paste a video URL to analyze and generate a professional script from it.
            </p>
          </>
        ) : (
          <>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm text-mute">Prompt</label>
              <TemplatePicker mode={mode} onPick={(t) => setPrompt(t.prompt)} />
            </div>
            <textarea
              className="field min-h-[120px] resize-y"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === "image"
                  ? "A tungsten-lit still life of brass instruments on velvet…"
                  : "A slow dolly across a rain-slick city street at dusk…"
              }
            />
          </>
        )}

        {mode === "image" ? (
          <>
            <div className="mt-4">
              <label className="mb-1 block text-sm text-mute">Model</label>
              <select className="field" value={imageModel} onChange={(e) => setImageModel(e.target.value)}>
                {imageModels.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm text-mute">Size</label>
              <select className="field" value={size} onChange={(e) => setSize(e.target.value)}>
                {IMAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </>
        ) : mode === "video" ? (
          <>
            <div className="mt-4">
              <label className="mb-1 block text-sm text-mute">Model</label>
              <select
                className="field"
                value={model}
                onChange={(e) => {
                  const next = e.target.value;
                  setModel(next);
                  // Snap duration to something the new model supports.
                  const allowed = videoModels.find((m) => m.id === next)?.durations ?? [5, 8];
                  if (!allowed.includes(duration)) setDuration(allowed[0]);
                }}
              >
                {videoModels.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm text-mute">Duration</label>
              <select
                className="field"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                {(videoModels.find((m) => m.id === model)?.durations ?? [5, 8]).map((d) => (
                  <option key={d} value={d}>{d}s</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm text-mute">
                Reference image <span className="text-mute/70">(optional — image-to-video)</span>
              </label>
              <input
                className="field"
                value={refImageUrl}
                onChange={(e) => setRefImageUrl(e.target.value)}
                placeholder="https://…/still-frame.jpg"
              />
              <p className="mt-1 text-xs text-mute">
                Paste an image URL to animate it instead of generating from text alone.
              </p>
            </div>
          </>
        ) : null}

        <button className="btn-amber mt-6 w-full" disabled={!canGenerate} onClick={generate}>
          {busy ? "Generating…" : `Generate — ${cost} credit${cost > 1 ? "s" : ""}`}
        </button>

        {credits < cost && (
          <p className="mt-3 text-sm text-warn">
            Not enough credits. <a href="/pricing" className="underline">Buy more</a>.
          </p>
        )}
        {error && <p className="mt-3 text-sm text-bad">{error}</p>}
      </div>

      {/* Output stage */}
      <div className="card flex min-h-[400px] items-center justify-center p-5">
        <Output mode={mode} busy={busy} current={current} />
      </div>
    </div>
  );
}

function Output({ mode, busy, current }) {
  if (!current && !busy) {
    return (
      <div className="text-center text-mute">
        <p className="font-mono text-xs uppercase tracking-widest">Output stage</p>
        <p className="mt-2 text-sm">Your generated {mode} appears here.</p>
      </div>
    );
  }

  if (current?.status === "completed") {
    if (current.type === "script" && current.resultText) {
      return (
        <div className="w-full overflow-auto">
          <div className="prose prose-sm prose-invert max-w-none">
            <pre className="whitespace-pre-wrap bg-ink-darker rounded p-4 text-paper text-sm leading-relaxed overflow-x-auto">
              {current.resultText}
            </pre>
          </div>
          <button
            onClick={() => {
              const text = current.resultText;
              navigator.clipboard.writeText(text);
            }}
            className="mt-4 rounded bg-amber px-3 py-1.5 text-sm text-ink transition hover:bg-amber/80"
          >
            Copy Script
          </button>
        </div>
      );
    }

    if (current.resultUrl) {
      return current.type === "video" ? (
        <video src={current.resultUrl} controls className="max-h-[70vh] w-full rounded" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={current.resultUrl} alt={current.prompt} className="max-h-[70vh] w-full rounded object-contain" />
      );
    }
  }

  if (current?.status === "failed") {
    return (
      <div className="text-center">
        <p className="text-bad">Generation failed.</p>
        <p className="mt-1 text-sm text-mute">{current.error ?? "Your credits were refunded."}</p>
      </div>
    );
  }

  // Processing / queued
  return (
    <div className="text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-rail border-t-amber" />
      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-mute">
        {mode === "video" ? "Rendering — this can take a minute" : mode === "script" ? "Analyzing video…" : "Painting the frame"}
      </p>
    </div>
  );
}
