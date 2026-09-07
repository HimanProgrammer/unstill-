import { randomUUID } from "crypto";
import { getModel, DEFAULT_VIDEO_MODEL } from "./catalog";

// PixVerse platform API (app-api.pixverse.ai). One key reaches every model
// version — the catalog's `endpoint` field holds the version string ("v5.6",
// "v6", …) passed as the `model` body param.
// Flow: POST text/generate (or img/generate) -> get video_id -> poll
// GET /openapi/v2/video/result/{video_id} until status is terminal.
// Every request needs a UNIQUE Ai-trace-id — reusing one stalls generations.

const BASE = process.env.PIXVERSE_API_BASE ?? "https://app-api.pixverse.ai";
const KEY = process.env.PIXVERSE_API_KEY ?? "";

const DEFAULT_QUALITY = process.env.PIXVERSE_QUALITY ?? "540p"; // 360p | 540p | 720p | 1080p

function headers(json = true) {
  if (!KEY) throw new Error("PIXVERSE_API_KEY is not set");
  const h = {
    "API-KEY": KEY,
    "Ai-trace-id": randomUUID(),
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

async function call(path, init) {
  const res = await fetch(`${BASE}/openapi/v2/${path}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PixVerse request failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  if (json?.ErrCode !== 0) {
    throw new Error(`PixVerse error ${json?.ErrCode}: ${json?.ErrMsg ?? "unknown"}`);
  }
  return json.Resp ?? {};
}

// Clamp the requested duration to the model's allowed values (nearest match).
function pickDuration(model, requested) {
  const allowed = model.durations ?? [5, 8];
  const want = Number(requested) || allowed[0];
  return allowed.reduce((best, d) =>
    Math.abs(d - want) < Math.abs(best - want) ? d : best,
  );
}

// Image-to-video needs an img_id; the upload endpoint accepts a remote URL.
async function uploadImage(imageUrl) {
  const form = new FormData();
  form.append("image_url", imageUrl);
  const resp = await call("image/upload", {
    method: "POST",
    headers: headers(false), // multipart boundary is set by fetch
    body: form,
  });
  if (!resp.img_id) throw new Error("PixVerse image upload returned no img_id");
  return resp.img_id;
}

export const pixverseVideoProvider = {
  async submitVideo(prompt, opts) {
    const model =
      (opts?.model && getModel(opts.model)) || getModel(DEFAULT_VIDEO_MODEL);
    if (model.provider !== "pixverse" || model.type !== "video") {
      throw new Error(`Unknown PixVerse video model: ${opts?.model}`);
    }

    const body = {
      model: model.endpoint, // version string, e.g. "v5.6"
      prompt,
      duration: pickDuration(model, opts?.duration),
      quality: opts?.quality ?? DEFAULT_QUALITY,
      aspect_ratio: opts?.aspectRatio ?? "16:9",
      seed: 0,
    };

    let path = "video/text/generate";
    if (opts?.imageUrl) {
      body.img_id = await uploadImage(opts.imageUrl);
      delete body.aspect_ratio; // i2v keeps the source image's ratio
      path = "video/img/generate";
    }

    const resp = await call(path, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!resp.video_id) throw new Error("PixVerse submit returned no video_id");
    return { providerJobId: String(resp.video_id) };
  },

  async getVideoStatus(providerJobId) {
    const resp = await call(`video/result/${providerJobId}`, {
      method: "GET",
      headers: headers(),
    });
    // status: 1 success, 5 waiting/generating, 7 moderation failure, 8 failed
    if (resp.status === 1) {
      return resp.url
        ? { status: "completed", resultUrl: resp.url }
        : { status: "failed", error: "Completed but no output URL" };
    }
    if (resp.status === 7) return { status: "failed", error: "Content moderation failure" };
    if (resp.status === 8) return { status: "failed", error: "Generation failed" };
    return { status: "processing" };
  },
};
