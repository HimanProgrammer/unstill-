// Seedance2 AI Provider Integration
// API: https://www.seedance2ai.io/app/api
// Key: sk_live_O9j2TqtJ4uRnXz-zSaRag7W-Djz77pTYmwvLKedg1o8

let _seedanceApiKey = null;

function getApiKey() {
  if (!_seedanceApiKey) {
    if (!process.env.SEEDANCE_API_KEY) {
      throw new Error("SEEDANCE_API_KEY is not set");
    }
    _seedanceApiKey = process.env.SEEDANCE_API_KEY;
  }
  return _seedanceApiKey;
}

export const SEEDANCE_MODELS = [
  {
    id: "seedance-standard",
    label: "Seedance Standard",
    provider: "seedance",
    type: "video",
    durations: [5, 8, 10, 15],
    isDefault: false,
  },
  {
    id: "seedance-premium",
    label: "Seedance Premium",
    provider: "seedance",
    type: "video",
    durations: [5, 8, 10, 15, 20],
    isDefault: false,
  },
  {
    id: "seedance-ultra",
    label: "Seedance Ultra",
    provider: "seedance",
    type: "video",
    durations: [5, 8, 10, 15, 20, 30],
    isDefault: false,
  },
];

/**
 * Submit video generation job to Seedance2 AI
 */
export async function seedanceSubmitVideo(modelId, prompt, opts) {
  const apiKey = getApiKey();

  const requestBody = {
    prompt: prompt,
    model: modelId || "seedance-standard",
    duration: opts.duration || 5,
    quality: opts.quality || "high",
    aspectRatio: opts.aspectRatio || "16:9",
    imageUrl: opts.imageUrl || undefined,
    style: opts.style || "cinematic",
  };

  try {
    const response = await fetch("https://www.seedance2ai.io/app/api/v1/videos/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-API-Version": "2024-01",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Seedance2 AI error: ${error.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.jobId && !data.id) {
      throw new Error("Seedance2 AI did not return a job ID");
    }

    return {
      providerJobId: data.jobId || data.id,
      jobId: data.jobId || data.id,
      estimatedTime: data.estimatedTime || 20,
    };
  } catch (err) {
    throw new Error(`Seedance2 AI submission failed: ${err.message}`);
  }
}

/**
 * Get video generation status from Seedance2 AI
 */
export async function seedanceGetVideoStatus(jobId) {
  const apiKey = getApiKey();

  try {
    const response = await fetch(
      `https://www.seedance2ai.io/app/api/v1/videos/status/${jobId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Map Seedance status to standard status
    const statusMap = {
      pending: "queued",
      queued: "queued",
      processing: "processing",
      rendering: "processing",
      completed: "completed",
      success: "completed",
      failed: "failed",
      error: "failed",
    };

    return {
      status: statusMap[data.status] || data.status,
      resultUrl: data.videoUrl || data.downloadUrl || null,
      videoUrl: data.videoUrl || null,
      downloadUrl: data.downloadUrl || null,
      error: data.error || null,
      progress: data.progress || 0,
      eta: data.eta || null,
    };
  } catch (err) {
    throw new Error(`Seedance2 AI status check failed: ${err.message}`);
  }
}

/**
 * Get Seedance2 AI subscription and pricing info
 */
export async function seedanceGetSubscriptionInfo() {
  return {
    provider: "seedance2ai",
    affiliate: {
      program: "Seedance2 AI Affiliate Program",
      url: "https://www.seedance2ai.io/affiliate",
      commissionRate: 0.20, // 20% commission
      cookieDuration: 45, // 45 days
      trackingLink: "https://www.seedance2ai.io/?ref=UNSTLL_AFFILIATE",
      description: "Earn 20% commission on all Seedance2 AI subscriptions",
    },
    pricing: {
      starter: {
        name: "Starter",
        price: "$19/month",
        videos: "20 videos/month",
        features: [
          "Standard quality",
          "up to 15s videos",
          "5 style options",
          "Email support",
        ],
      },
      pro: {
        name: "Pro",
        price: "$59/month",
        videos: "100 videos/month",
        features: [
          "Premium quality",
          "up to 20s videos",
          "20+ style options",
          "Priority support",
          "Custom branding",
        ],
      },
      ultra: {
        name: "Ultra",
        price: "$199/month",
        videos: "Unlimited",
        features: [
          "Ultra quality 4K",
          "up to 30s videos",
          "50+ style options",
          "24/7 support",
          "API access",
          "Batch processing",
          "White label",
        ],
      },
      enterprise: {
        name: "Enterprise",
        price: "Custom",
        videos: "Custom",
        features: [
          "Unlimited everything",
          "Dedicated API",
          "Custom models",
          "Priority rendering",
          "SLA guarantee",
          "Onboarding",
        ],
      },
    },
    models: SEEDANCE_MODELS,
  };
}

/**
 * List available styles/templates from Seedance2 AI
 */
export async function seedanceGetStyles() {
  const apiKey = getApiKey();

  try {
    const response = await fetch(
      "https://www.seedance2ai.io/app/api/v1/styles",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch styles: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Seedance2 AI styles fetch failed:", err);
    // Return default styles if fetch fails
    return {
      styles: [
        { id: "cinematic", name: "Cinematic" },
        { id: "anime", name: "Anime" },
        { id: "realistic", name: "Realistic" },
        { id: "cartoon", name: "Cartoon" },
        { id: "artistic", name: "Artistic" },
      ],
    };
  }
}
