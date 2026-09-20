"use client";

import { useState } from "react";

export function ScriptToVideo({ videoModels }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedModel, setSelectedModel] = useState(videoModels[0]?.id || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [script, setScript] = useState("");
  const [scenes, setScenes] = useState([]);
  const [step, setStep] = useState("input"); // input | script | scenes | generating

  async function generateScript() {
    setError("");
    setBusy(true);

    try {
      const res = await fetch("/api/tools/script-to-scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: videoUrl.trim(),
          model: selectedModel,
          parseScenes: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate script");
        setBusy(false);
        return;
      }

      setScript(data.generation.resultText);
      setScenes(data.scenes || []);
      setStep(data.scenes?.length > 0 ? "scenes" : "script");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function generateVideos() {
    if (scenes.length === 0) {
      setError("No scenes to generate");
      return;
    }

    setError("");
    setBusy(true);
    setStep("generating");

    try {
      const results = [];
      for (const scene of scenes) {
        const res = await fetch("/api/generate/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: scene.videoPrompt,
            model: selectedModel,
            duration: parseDuration(scene.timing),
          }),
        });

        const data = await res.json();
        if (res.ok) {
          results.push({
            scene: scene.order,
            generationId: data.generation?.id,
            status: "queued",
          });
        } else {
          results.push({
            scene: scene.order,
            error: data.error,
          });
        }
      }

      setScenes(scenes.map((s, i) => ({
        ...s,
        generationStatus: results[i],
      })));

      setStep("results");
    } catch {
      setError("Failed to submit videos");
    } finally {
      setBusy(false);
    }
  }

  function parseDuration(timingStr) {
    const match = timingStr?.match(/(\d+)/);
    return match ? Math.min(Math.max(parseInt(match[1]), 1), 20) : 5;
  }

  return (
    <div className="space-y-6">
      {step === "input" && (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium">Video URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="field w-full"
            />
            <p className="mt-1 text-xs text-mute">
              Reference video to analyze and convert to multi-scene video project
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Video Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="field w-full"
            >
              {videoModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-mute">
              Model to use for generating videos from script scenes
            </p>
          </div>

          <button
            onClick={generateScript}
            disabled={!videoUrl.trim() || busy}
            className="btn-amber w-full"
          >
            {busy ? "Analyzing…" : "Analyze Video & Generate Script — 5 credits"}
          </button>

          {error && <p className="text-sm text-bad">{error}</p>}
        </>
      )}

      {step === "script" && (
        <>
          <div>
            <h3 className="mb-2 text-sm font-medium">Generated Script</h3>
            <pre className="max-h-96 overflow-auto rounded bg-ink-darker p-4 text-xs text-paper">
              {script}
            </pre>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setStep("input");
                setScript("");
                setScenes([]);
              }}
              className="btn-secondary flex-1"
            >
              Start Over
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(script);
              }}
              className="btn-secondary flex-1"
            >
              Copy Script
            </button>
          </div>
        </>
      )}

      {step === "scenes" && (
        <>
          <div>
            <h3 className="mb-3 text-sm font-medium">
              Parsed Scenes ({scenes.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scenes.map((scene) => (
                <div key={scene.order} className="rounded border border-rail/30 bg-ink-darker/30 p-3">
                  <p className="text-xs font-mono uppercase text-mute">
                    Scene {scene.order} • {scene.timing}
                  </p>
                  <p className="mt-1 text-sm text-paper">{scene.videoPrompt}</p>
                  {scene.narration && (
                    <p className="mt-1 text-xs text-mute italic">
                      "{scene.narration}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setStep("input");
                setScript("");
                setScenes([]);
              }}
              className="btn-secondary flex-1"
            >
              Start Over
            </button>
            <button
              onClick={generateVideos}
              disabled={busy}
              className="btn-amber flex-1"
            >
              {busy ? "Generating…" : `Generate Videos — ${scenes.length * 10} credits`}
            </button>
          </div>

          {error && <p className="text-sm text-bad">{error}</p>}
        </>
      )}

      {step === "results" && (
        <>
          <div>
            <h3 className="mb-3 text-sm font-medium">Video Generation Jobs</h3>
            <div className="space-y-2">
              {scenes.map((scene) => (
                <div
                  key={scene.order}
                  className="flex items-center justify-between rounded border border-rail/30 bg-ink-darker/30 p-3"
                >
                  <div>
                    <p className="text-xs font-mono uppercase text-mute">
                      Scene {scene.order}
                    </p>
                    <p className="mt-1 text-sm text-paper line-clamp-1">
                      {scene.videoPrompt}
                    </p>
                  </div>
                  <div className="text-right">
                    {scene.generationStatus?.error ? (
                      <p className="text-xs text-bad">Failed</p>
                    ) : (
                      <>
                        <p className="text-xs text-amber">
                          {scene.generationStatus?.status || "Queued"}
                        </p>
                        <p className="text-[10px] text-mute">
                          ID: {scene.generationStatus?.generationId?.slice(0, 8)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-rail/30 bg-amber/10 p-3">
            <p className="text-xs text-paper">
              <strong>✓ Submitted!</strong> Videos are now being generated. You can
              view progress in the Gallery or check individual job statuses.
            </p>
          </div>

          <button
            onClick={() => {
              setStep("input");
              setScript("");
              setScenes([]);
            }}
            className="btn-secondary w-full"
          >
            New Project
          </button>
        </>
      )}
    </div>
  );
}
