import { openaiImageProvider } from "./openai";
import { wavespeedGenerateImage, wavespeedSubmitVideo, wavespeedGetVideoStatus } from "./wavespeed";
import { pixverseVideoProvider } from "./pixverse";
import { polloSubmitVideo, polloGetVideoStatus } from "./pollo";
import {
  IMAGE_MODELS,
  VIDEO_MODELS,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_VIDEO_MODEL,
  getModel,
} from "./catalog";

// Video generation is routed per-model:
// - PixVerse models → PixVerse client (supports image-to-video)
// - Pollo models → Pollo.ai client
// - Everything else → WaveSpeedAI aggregator (Veo, Kling, Hailuo, Wan, Luma, Sora, LTX, …)
// `getVideoStatus` takes the model id too since a bare job id doesn't say
// which provider it belongs to.
export const videoProvider = {
  async submitVideo(prompt, opts) {
    const model = (opts?.model && getModel(opts.model)) || getModel(DEFAULT_VIDEO_MODEL);
    if (model.provider === "pollo") {
      return polloSubmitVideo(model.id, prompt, opts);
    }
    if (model.provider === "wavespeed") {
      return wavespeedSubmitVideo(model.id, prompt, opts);
    }
    return pixverseVideoProvider.submitVideo(prompt, { ...opts, model: model.id });
  },
  async getVideoStatus(modelId, providerJobId) {
    const model = (modelId && getModel(modelId)) || getModel(DEFAULT_VIDEO_MODEL);
    if (model.provider === "pollo") return polloGetVideoStatus(providerJobId);
    if (model.provider === "wavespeed") return wavespeedGetVideoStatus(providerJobId);
    return pixverseVideoProvider.getVideoStatus(providerJobId);
  },
};

// Image generation is routed per-model: OpenAI models go to OpenAI, everything
// else goes to WaveSpeed. Kept as a synchronous call so the image API route
// stays simple.
export async function generateImage(modelId, prompt, opts) {
  const model = (modelId && getModel(modelId)) || getModel(DEFAULT_IMAGE_MODEL);
  if (model.type !== "image") throw new Error(`${model.id} is not an image model`);

  if (model.provider === "openai") {
    return { result: await openaiImageProvider.generateImage(prompt, opts), provider: "openai" };
  }
  return { result: await wavespeedGenerateImage(model.id, prompt, opts), provider: "wavespeed" };
}

// Surfaced to the UI so the studio can offer model dropdowns.
export const videoModels = VIDEO_MODELS.map((m) => ({
  id: m.id,
  label: m.label,
  durations: m.durations ?? [5, 8],
  isDefault: m.id === DEFAULT_VIDEO_MODEL,
}));

export const imageModels = IMAGE_MODELS.map((m) => ({
  id: m.id,
  label: m.label,
  isDefault: m.id === DEFAULT_IMAGE_MODEL,
}));

export const DEFAULT_MODEL = DEFAULT_VIDEO_MODEL;
export { DEFAULT_IMAGE_MODEL, DEFAULT_VIDEO_MODEL };
