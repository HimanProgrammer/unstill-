import { getModel } from "./catalog";

// WaveSpeedAI is a single-key aggregator: one API key reaches many underlying
// image models (Nano Banana, Seedream, Flux, Z-Image…). Video generation now
// goes through PixVerse (see pixverse.js).
// Flow: POST the model endpoint -> get a prediction id -> poll
// GET /api/v3/predictions/{id}/result until data.status === "completed".

const BASE = process.env.WAVESPEED_API_BASE ?? "https://api.wavespeed.ai";
const KEY = process.env.WAVESPEED_API_KEY ?? "";

function headers() {
  if (!KEY) throw new Error("WAVESPEED_API_KEY is not set");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${KEY}`,
  };
}

// Uploads a raw file (image/video/audio) and returns a public URL WaveSpeed
// (and thus any of our tools) can fetch back — good for 7 days. Used so
// users can upload a file instead of pasting a URL in the Edit tools.
export async function wavespeedUploadFile(buffer, filename, contentType) {
  if (!KEY) throw new Error("WAVESPEED_API_KEY is not set");
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: contentType }), filename);
  const res = await fetch(`${BASE}/api/v3/media/upload/binary`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WaveSpeed upload failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  const url = json?.data?.download_url;
  if (!url) throw new Error("WaveSpeed upload returned no URL");
  return url;
}

async function submit(path, body) {
  const res = await fetch(`${BASE}/api/v3/${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WaveSpeed submit failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  const id = json?.data?.id;
  if (!id) throw new Error("WaveSpeed submit returned no prediction id");
  return id;
}

async function pollOnce(id) {
  const res = await fetch(`${BASE}/api/v3/predictions/${id}/result`, {
    method: "GET",
    headers: headers(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WaveSpeed status failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  const data = json?.data ?? {};
  const status = data.status ?? "processing";
  if (status === "completed") {
    const url = Array.isArray(data.outputs) ? data.outputs[0] : undefined;
    return url ? { status, url } : { status: "failed", error: "Completed but no output URL" };
  }
  if (status === "failed") return { status, error: data.error ?? "Generation failed" };
  return { status: "processing" };
}

// Clamp the requested duration to the model's allowed values (nearest match).
function pickDuration(model, requested) {
  const allowed = model.durations ?? [5];
  const want = Number(requested) || allowed[0];
  return allowed.reduce((best, d) => (Math.abs(d - want) < Math.abs(best - want) ? d : best));
}

// ------------------------------- VIDEO ------------------------------------
// Every WaveSpeed video model in our catalog only needs {prompt, duration} —
// reference-image/video params vary per model and aren't wired up here (only
// PixVerse's image-to-video is supported today; see pixverse.js).
export async function wavespeedSubmitVideo(modelId, prompt, opts) {
  const model = getModel(modelId);
  if (!model || model.provider !== "wavespeed" || model.type !== "video") {
    throw new Error(`Unknown WaveSpeed video model: ${modelId}`);
  }
  const body = { prompt, duration: pickDuration(model, opts?.duration) };
  const id = await submit(model.endpoint, body);
  return { providerJobId: id };
}

export async function wavespeedGetVideoStatus(providerJobId) {
  const r = await pollOnce(providerJobId);
  if (r.status === "completed") return { status: "completed", resultUrl: r.url };
  if (r.status === "failed") return { status: "failed", error: r.error ?? "Generation failed" };
  return { status: "processing" };
}

// -------------------------------- TOOLS ------------------------------------
// Generic "video/audio in, video/audio/text out" tools — transcription,
// caption burn-in, vocal isolation, prompt-based video edit. Each just needs
// the right body shape for its model; status polling is shared and returns
// either a resultUrl (media) or resultText (e.g. a transcript string), since
// WaveSpeed's first output isn't always a URL.
export const TOOLS = {
  transcribe: {
    endpoint: "wavespeed-ai/openai-whisper-with-video",
    body: (input) => ({ video: input.url, task: "transcribe" }),
  },
  captions: {
    endpoint: "veed/subtitles",
    body: (input) => ({
      video: input.url,
      preset: input.preset || "simple",
      position: input.position || "bottom",
    }),
  },
  "audio-enhance": {
    endpoint: "wavespeed-ai/audio-vocal-isolator",
    body: (input) => ({ audio: input.url }),
  },
  "auto-edit": {
    endpoint: "wavespeed-ai/wan-2.2/video-edit",
    body: (input) => ({ video: input.url, prompt: input.prompt, resolution: "720p" }),
  },
  "bg-remove": {
    // One-click background / green-screen removal (optionally onto a new backdrop).
    endpoint: "wavespeed-ai/video-background-remover",
    body: (input) => ({
      video: input.url,
      ...(input.backgroundImage ? { background_image: input.backgroundImage } : {}),
    }),
  },
  rotoscope: {
    // Prompt-based subject segmentation & mask tracking across every frame
    // (SAM3) — text-driven rotoscoping instead of manual per-frame masking.
    endpoint: "wavespeed-ai/sam3-video",
    body: (input) => ({ video: input.url, prompt: input.prompt || "person", apply_mask: true }),
  },
};

export async function wavespeedRunTool(tool, input) {
  const spec = TOOLS[tool];
  if (!spec) throw new Error(`Unknown tool: ${tool}`);
  const id = await submit(spec.endpoint, spec.body(input));
  return { providerJobId: id };
}

export async function wavespeedGetToolStatus(providerJobId) {
  const res = await fetch(`${BASE}/api/v3/predictions/${providerJobId}/result`, { headers: headers() });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WaveSpeed status failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  const data = json?.data ?? {};
  if (data.status === "completed") {
    let first = Array.isArray(data.outputs) ? data.outputs[0] : undefined;
    if (first == null) return { status: "failed", error: "Completed but no output" };
    // Some tools (e.g. Whisper transcription) return { text: "..." } instead
    // of a bare string or media URL.
    if (typeof first === "object") first = first.text ?? first.url ?? JSON.stringify(first);
    return /^https?:\/\//.test(first)
      ? { status: "completed", resultUrl: first }
      : { status: "completed", resultText: String(first) || "(no speech detected)" };
  }
  if (data.status === "failed") return { status: "failed", error: data.error ?? "Job failed" };
  return { status: "processing" };
}

// ------------------------------- IMAGE ------------------------------------
// WaveSpeed image models are also submit+poll, but generation is fast, so we
// poll server-side and resolve synchronously to match the image provider shape.
export async function wavespeedGenerateImage(modelId, prompt, opts) {
  const model = getModel(modelId);
  if (!model || model.provider !== "wavespeed") {
    throw new Error(`Unknown WaveSpeed image model: ${modelId}`);
  }

  const body = { prompt, seed: -1 };
  if (opts?.size) body.size = opts.size;

  const id = await submit(model.endpoint, body);

  // Poll up to ~90s (WaveSpeed images typically finish in a few seconds).
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    const r = await pollOnce(id);
    if (r.status === "completed") return { url: r.url };
    if (r.status === "failed") throw new Error(r.error ?? "Image generation failed");
    await new Promise((res) => setTimeout(res, 1500));
  }
  throw new Error("Image generation timed out");
}
