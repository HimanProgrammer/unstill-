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
