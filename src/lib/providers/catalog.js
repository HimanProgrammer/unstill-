// ---------------------------------------------------------------------------
// MODEL CATALOG — single source of truth for every model in the app.
//
// This one list drives: the Studio dropdowns (image + video), the /models
// pricing table, and the request routing in the providers. To add or change a
// model, edit only this file.
//
// For WaveSpeed image models, `endpoint` is the path used as /api/v3/<endpoint>
// (see wavespeed.js). For PixVerse video models, `endpoint` is the model version
// string ("v5.6", "v6", …) sent as the `model` body param (see pixverse.js).
// For OpenAI-hosted models `provider` is "openai" and `endpoint` is unused.
//
// PixVerse durations differ per version: v3.5–v5 allow 5/8s, v5.5/v5.6 allow
// 5/8/10s, v6/c1 allow 1–15s. `durations` lists the choices we surface.
// PixVerse bills in platform credits that scale with quality (360p→1080p);
// the USD prices below are ~540p estimates for the /models display only.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} ModelSpec
 * @property {string} id
 * @property {string} label
 * @property {"image"|"video"} type
 * @property {"openai"|"wavespeed"|"pixverse"} provider
 * @property {string} endpoint
 * @property {"image"|"second"} unit
 * @property {number} price
 * @property {string} outputPerDollar
 * @property {number[]} [durations]
 * @property {boolean} [isDefault]
 * @property {string} [note]
 */

/** @type {ModelSpec[]} */
export const MODELS = [
  // -------------------------------- IMAGE ---------------------------------
  {
    id: "gpt-image-1",
    label: "GPT Image 1",
    type: "image",
    provider: "openai",
    endpoint: "",
    unit: "image",
    price: 0.04,
    outputPerDollar: "25 images",
    isDefault: true,
    note: "OpenAI",
  },
  {
    id: "nano-banana-2",
    label: "Nano Banana 2",
    type: "image",
    provider: "wavespeed",
    endpoint: "google/nano-banana-2/text-to-image",
    unit: "image",
    price: 0.07,
    outputPerDollar: "14 images",
  },
  {
    id: "nano-banana-pro",
    label: "Nano Banana Pro",
    type: "image",
    provider: "wavespeed",
    endpoint: "google/nano-banana-pro/text-to-image",
    unit: "image",
    price: 0.14,
    outputPerDollar: "7 images",
  },
  {
    id: "seedream-4.5",
    label: "Seedream 4.5",
    type: "image",
    provider: "wavespeed",
    endpoint: "bytedance/seedream-v4.5",
    unit: "image",
    price: 0.04,
    outputPerDollar: "25 images",
  },
  {
    id: "flux-2-klein",
    label: "Flux 2 Klein",
    type: "image",
    provider: "wavespeed",
    endpoint: "black-forest-labs/flux-2-klein",
    unit: "image",
    price: 0.008,
    outputPerDollar: "125 images",
  },
  {
    id: "z-image-turbo",
    label: "Z Image Turbo",
    type: "image",
    provider: "wavespeed",
    endpoint: "wavespeed-ai/z-image/turbo",
    unit: "image",
    price: 0.005,
    outputPerDollar: "200 images",
  },

  // ----------------------- VIDEO (PixVerse, all models) -------------------
  {
    id: "pixverse-v3.5",
    label: "PixVerse v3.5",
    type: "video",
    provider: "pixverse",
    endpoint: "v3.5",
    unit: "second",
    price: 0.03,
    outputPerDollar: "33 seconds",
    durations: [5, 8],
  },
  {
    id: "pixverse-v4",
    label: "PixVerse v4",
    type: "video",
    provider: "pixverse",
    endpoint: "v4",
    unit: "second",
    price: 0.03,
    outputPerDollar: "33 seconds",
    durations: [5, 8],
  },
  {
    id: "pixverse-v4.5",
    label: "PixVerse v4.5",
    type: "video",
    provider: "pixverse",
    endpoint: "v4.5",
    unit: "second",
    price: 0.03,
    outputPerDollar: "33 seconds",
    durations: [5, 8],
  },
  {
    id: "pixverse-v5",
    label: "PixVerse v5",
    type: "video",
    provider: "pixverse",
    endpoint: "v5",
    unit: "second",
    price: 0.03,
    outputPerDollar: "33 seconds",
    durations: [5, 8],
  },
  {
    id: "pixverse-v5.5",
    label: "PixVerse v5.5",
    type: "video",
    provider: "pixverse",
    endpoint: "v5.5",
    unit: "second",
    price: 0.04,
    outputPerDollar: "25 seconds",
    durations: [5, 8, 10],
    isDefault: true,
  },
  {
    id: "pixverse-v5.6",
    label: "PixVerse v5.6",
    type: "video",
    provider: "pixverse",
    endpoint: "v5.6",
    unit: "second",
    price: 0.04,
    outputPerDollar: "25 seconds",
    durations: [5, 8, 10],
    note: "audio + physics",
  },
  {
    id: "pixverse-v6",
    label: "PixVerse v6",
    type: "video",
    provider: "pixverse",
    endpoint: "v6",
    unit: "second",
    price: 0.06,
    outputPerDollar: "16.6 seconds",
    durations: [5, 8, 10, 15],
    note: "latest, 1–15s",
  },
  {
    id: "pixverse-c1",
    label: "PixVerse C1",
    type: "video",
    provider: "pixverse",
    endpoint: "c1",
    unit: "second",
    price: 0.03,
    outputPerDollar: "33 seconds",
    durations: [5, 8, 10, 15],
    note: "creative, 1–15s",
  },

  // ----------------------- VIDEO (Seedance2 AI) ----------------------------
  {
    id: "seedance-standard",
    label: "Seedance Standard",
    type: "video",
    provider: "seedance",
    endpoint: "standard",
    unit: "second",
    price: 0.095,
    outputPerDollar: "~10.5 seconds",
    durations: [5, 8, 10, 15],
  },
  {
    id: "seedance-premium",
    label: "Seedance Premium",
    type: "video",
    provider: "seedance",
    endpoint: "premium",
    unit: "second",
    price: 0.118,
    outputPerDollar: "~8.5 seconds",
    durations: [5, 8, 10, 15, 20],
  },
  {
    id: "seedance-ultra",
    label: "Seedance Ultra",
    type: "video",
    provider: "seedance",
    endpoint: "ultra",
    unit: "second",
    price: 0.165,
    outputPerDollar: "~6 seconds",
    durations: [5, 8, 10, 15, 20, 30],
    note: "4K quality",
  },

  // ----------------------- VIDEO (Pollo.ai) --------------------------------
  {
    id: "pollo-photorealistic",
    label: "Pollo Photorealistic",
    type: "video",
    provider: "pollo",
    endpoint: "photorealistic",
    unit: "second",
    price: 0.09,
    outputPerDollar: "~11 seconds",
    durations: [5, 8, 10],
  },
  {
    id: "pollo-anime",
    label: "Pollo Anime",
    type: "video",
    provider: "pollo",
    endpoint: "anime",
    unit: "second",
    price: 0.09,
    outputPerDollar: "~11 seconds",
    durations: [5, 8, 10],
  },
  {
    id: "pollo-3d",
    label: "Pollo 3D Animation",
    type: "video",
    provider: "pollo",
    endpoint: "3d-animation",
    unit: "second",
    price: 0.11,
    outputPerDollar: "~9 seconds",
    durations: [5, 8, 10],
  },
  {
    id: "pollo-cinematic",
    label: "Pollo Cinematic",
    type: "video",
    provider: "pollo",
    endpoint: "cinematic",
    unit: "second",
    price: 0.12,
    outputPerDollar: "~8 seconds",
    durations: [5, 8, 10],
    note: "high quality",
  },
  {
    id: "pollo-stylized",
    label: "Pollo Stylized",
    type: "video",
    provider: "pollo",
    endpoint: "stylized",
    unit: "second",
    price: 0.10,
    outputPerDollar: "10 seconds",
    durations: [5, 8, 10],
  },

  // ----------------------- VIDEO (WaveSpeedAI aggregator) -----------------
  {
    id: "veo-3.1-fast",
    label: "Google Veo 3.1 Fast",
    type: "video",
    provider: "wavespeed",
    endpoint: "google/veo3.1-fast/text-to-video",
    unit: "second",
    price: 0.15,
    outputPerDollar: "~6.7 seconds",
    durations: [4, 6, 8],
    note: "premium",
  },
  {
    id: "kling-v2.6-pro",
    label: "Kling v2.6 Pro",
    type: "video",
    provider: "wavespeed",
    endpoint: "kwaivgi/kling-v2.6-pro/text-to-video",
    unit: "second",
    price: 0.07,
    outputPerDollar: "~14 seconds",
    durations: [5, 10],
  },
  {
    id: "hailuo-02-standard",
    label: "MiniMax Hailuo 02",
    type: "video",
    provider: "wavespeed",
    endpoint: "minimax/hailuo-02/t2v-standard",
    unit: "second",
    price: 0.038,
    outputPerDollar: "~26 seconds",
    durations: [6, 10],
  },
  {
    id: "wan-2.5",
    label: "Alibaba Wan 2.5",
    type: "video",
    provider: "wavespeed",
    endpoint: "alibaba/wan-2.5/text-to-video",
    unit: "second",
    price: 0.05,
    outputPerDollar: "20 seconds",
    durations: [5, 10],
  },
  {
    id: "luma-ray-2",
    label: "Luma Ray 2",
    type: "video",
    provider: "wavespeed",
    endpoint: "luma/ray-2-t2v",
    unit: "second",
    price: 0.08,
    outputPerDollar: "12.5 seconds",
    durations: [5, 10],
  },
  {
    id: "sora-2",
    label: "OpenAI Sora 2",
    type: "video",
    provider: "wavespeed",
    endpoint: "openai/sora-2/text-to-video",
    unit: "second",
    price: 0.1,
    outputPerDollar: "10 seconds",
    durations: [4, 8, 12, 16, 20],
    note: "premium",
  },
  {
    id: "ltx-2-fast",
    label: "LTX-2 Fast",
    type: "video",
    provider: "wavespeed",
    endpoint: "lightricks/ltx-2-fast/text-to-video",
    unit: "second",
    price: 0.007,
    outputPerDollar: "~143 seconds",
    durations: [6, 8, 10, 12, 14, 16, 18, 20],
    note: "cheapest",
  },
  {
    id: "pika-via-pollo",
    label: "Pika AI (via Pollo)",
    type: "video",
    provider: "wavespeed",
    endpoint: "pika/pika-ai/text-to-video",
    unit: "second",
    price: 0.01,
    outputPerDollar: "100 seconds",
    durations: [5, 10, 15],
    note: "fast, affordable",
  },
];

export const IMAGE_MODELS = MODELS.filter((m) => m.type === "image");
export const VIDEO_MODELS = MODELS.filter((m) => m.type === "video");

export const DEFAULT_IMAGE_MODEL = (IMAGE_MODELS.find((m) => m.isDefault) ?? IMAGE_MODELS[0]).id;
export const DEFAULT_VIDEO_MODEL = (VIDEO_MODELS.find((m) => m.isDefault) ?? VIDEO_MODELS[0]).id;

export function getModel(id) {
  return MODELS.find((m) => m.id === id);
}
