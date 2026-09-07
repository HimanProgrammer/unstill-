import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const openaiImageProvider = {
  async generateImage(prompt, opts) {
    const result = await openai.images.generate({
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
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: 300,
  });
  return res.choices[0]?.message?.content ?? "";
}
