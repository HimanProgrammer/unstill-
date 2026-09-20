import fetch from 'node-fetch';

// Built lazily like OpenAI
let _polloApiKey = null;
function getApiKey() {
  if (!_polloApiKey) {
    if (!process.env.POLLO_API_KEY) throw new Error("POLLO_API_KEY is not set");
    _polloApiKey = process.env.POLLO_API_KEY;
  }
  return _polloApiKey;
}

export const POLLO_MODELS = [
  {
    id: "pollo-photorealistic",
    label: "Pollo Photorealistic",
    provider: "pollo",
    type: "video",
    durations: [5, 8, 10],
    isDefault: false,
  },
  {
    id: "pollo-anime",
    label: "Pollo Anime",
    provider: "pollo",
    type: "video",
    durations: [5, 8, 10],
    isDefault: false,
  },
  {
    id: "pollo-3d",
    label: "Pollo 3D Animation",
    provider: "pollo",
    type: "video",
    durations: [5, 8, 10],
    isDefault: false,
  },
  {
    id: "pollo-cinematic",
    label: "Pollo Cinematic",
    provider: "pollo",
    type: "video",
    durations: [5, 8, 10],
    isDefault: false,
  },
  {
    id: "pollo-stylized",
    label: "Pollo Stylized",
    provider: "pollo",
    type: "video",
    durations: [5, 8, 10],
    isDefault: false,
  },
];

export async function polloSubmitVideo(modelId, prompt, opts) {
  const apiKey = getApiKey();

  // Map model ID to Pollo's model name
  const modelMap = {
    "pollo-photorealistic": "photorealistic",
    "pollo-anime": "anime",
    "pollo-3d": "3d-animation",
    "pollo-cinematic": "cinematic",
    "pollo-stylized": "stylized",
  };

  const polloModel = modelMap[modelId] || "photorealistic";

  const requestBody = {
    prompt: prompt,
    model: polloModel,
    duration: opts.duration || 5,
    aspectRatio: opts.aspectRatio || "16:9",
    refImage: opts.imageUrl || undefined,
  };

  try {
    const response = await fetch("https://api.pollo.ai/v1/video/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Pollo.ai error: ${error.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.jobId) {
      throw new Error("Pollo.ai did not return a job ID");
    }

    return {
      providerJobId: data.jobId,
      jobId: data.jobId,
    };
  } catch (err) {
    throw new Error(`Pollo.ai submission failed: ${err.message}`);
  }
}

export async function polloGetVideoStatus(jobId) {
  const apiKey = getApiKey();

  try {
    const response = await fetch(`https://api.pollo.ai/v1/video/status/${jobId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Map Pollo status to standard status
    const statusMap = {
      "pending": "queued",
      "processing": "processing",
      "completed": "completed",
      "failed": "failed",
      "error": "failed",
    };

    return {
      status: statusMap[data.status] || data.status,
      resultUrl: data.videoUrl || data.url || null,
      error: data.error || null,
      progress: data.progress || 0,
    };
  } catch (err) {
    throw new Error(`Pollo.ai status check failed: ${err.message}`);
  }
}

/**
 * Get Pollo.ai subscription info for affiliate program
 */
export async function polloGetSubscriptionInfo() {
  return {
    provider: "pollo",
    affiliate: {
      program: "Pollo.ai Affiliate Program",
      url: "https://pollo.ai/affiliate",
      commissionRate: 0.30, // 30% commission
      cookie_duration: 30, // 30 days
      trackingLink: "https://pollo.ai/?ref=UNSTLL_AFFILIATE_CODE",
      description: "Earn 30% commission on all Pollo.ai subscriptions referred through your link",
    },
    pricing: {
      starter: {
        name: "Starter",
        price: "$9/month",
        videos: "100 videos/month",
        features: [
          "All 5 models",
          "up to 10s videos",
          "Standard quality",
        ],
      },
      pro: {
        name: "Pro",
        price: "$29/month",
        videos: "500 videos/month",
        features: [
          "All 5 models",
          "up to 15s videos",
          "HD quality",
          "Priority processing",
        ],
      },
      enterprise: {
        name: "Enterprise",
        price: "Custom",
        videos: "Unlimited",
        features: [
          "All 5 models",
          "Custom duration",
          "4K quality",
          "API access",
          "Dedicated support",
        ],
      },
    },
    models: POLLO_MODELS,
  };
}
