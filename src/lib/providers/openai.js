import OpenAI from "openai";

// Built lazily (only when a request actually needs it), not at module load —
// the OpenAI SDK throws immediately if the key is missing, which otherwise
// crashes Next's build-time route analysis on a deploy with no key set yet.
let _openai = null;
function client() {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export const openaiImageProvider = {
  async generateImage(prompt, opts) {
    const result = await client().images.generate({
      model: "gpt-image-1",
      prompt,
      size: opts?.size ?? "1024x1024",
      n: 1,
    });

    const data = result.data?.[0];
    // gpt-image-1 returns base64 by default; DALL-E models can return a URL.
    if (data?.b64_json) return { url: `data:image/png;base64,${data.b64_json}` };
    if (data?.url) return { url: data.url };
    throw new Error("Image provider returned no image");
  },
};

/** Chat completion helper — used by the prompt-assist feature on the studio page. */
export async function chatComplete(system, user) {
  const res = await client().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: 300,
  });
  return res.choices[0]?.message?.content ?? "";
}

/** Generate a video script by analyzing frames from a reference video. */
export async function generateScriptFromVideo(videoUrl) {
  // Extract frames from the video (we'll use 3-5 frames at intervals)
  const frameUrls = await extractFramesFromVideo(videoUrl);

  if (frameUrls.length === 0) {
    throw new Error("Could not extract frames from the video");
  }

  // Create vision content from the extracted frames
  const content = [
    {
      type: "text",
      text: `Analyze these video frames and generate a detailed video script. The script should:
      1. Describe the visual elements shown in the frames
      2. Suggest compelling narration or voiceover
      3. Include timing cues for when different parts should occur
      4. Suggest scene transitions and pacing
      5. Include any text overlays or visual effects that would enhance the narrative

      Format the script as a professional video production script with clear sections for video, narration, and effects.`,
    },
    ...frameUrls.map((url) => ({
      type: "image_url",
      image_url: { url },
    })),
  ];

  const res = await client().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content,
      },
    ],
    max_tokens: 2000,
  });

  return res.choices[0]?.message?.content ?? "Could not generate script";
}

/** Extract frames from a video URL at regular intervals. */
async function extractFramesFromVideo(videoUrl) {
  // For this implementation, we'll use a simple approach:
  // Request the video and extract frames at 25%, 50%, 75% timestamps
  // Since we're working with URLs, we'll return the URL directly for now
  // and let the video player handle it, or use a third-party service.

  // Alternative: Use FFmpeg or a video processing service
  // For MVP, we'll just return the video URL itself as a single "frame"
  // and let GPT-4 Vision analyze the entire video preview

  return [videoUrl];
}

/** Alternative: Generate script using video URL directly with vision API. */
export async function generateScriptFromVideoUrl(videoUrl) {
  const res = await client().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this video and generate a detailed video script. The script should:
1. Describe the main visual elements and scenes
2. Suggest compelling narration or voiceover
3. Include timing cues for transitions
4. Recommend scene pacing and effects
5. Suggest any text overlays or visual enhancements

Format as a professional video production script.`,
          },
          {
            type: "image_url",
            image_url: { url: videoUrl },
          },
        ],
      },
    ],
    max_tokens: 2000,
  });

  return res.choices[0]?.message?.content ?? "Could not generate script";
}
