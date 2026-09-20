import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { generateScriptFromVideoUrl } from "@/lib/providers/openai";
import { spendCredits, refundCredits, CREDIT_COST, InsufficientCreditsError } from "@/lib/credits";

const schema = z.object({
  videoUrl: z.string().url("Valid video URL required"),
  model: z.string().optional(),
  parseScenes: z.boolean().default(true),
});

export async function POST(req) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const cost = CREDIT_COST.script;

  try {
    await spendCredits(userId, cost, "script_to_scenes");
  } catch (e) {
    if (e instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
    }
    throw e;
  }

  const gen = await db.generation.create({
    data: {
      userId,
      type: "script",
      provider: "openai",
      model: "gpt-4o",
      prompt: parsed.data.videoUrl,
      status: "processing",
      costCredits: cost,
    },
  });

  try {
    // Generate script from video
    const script = await generateScriptFromVideoUrl(parsed.data.videoUrl);

    // Parse scenes from script if requested
    let scenes = [];
    if (parsed.data.parseScenes) {
      scenes = parseScriptIntoScenes(script);
    }

    const updated = await db.generation.update({
      where: { id: gen.id },
      data: {
        status: "completed",
        resultText: script,
      },
    });

    return NextResponse.json({
      generation: updated,
      scenes: scenes,
      sceneCount: scenes.length,
      selectedModel: parsed.data.model,
    });
  } catch (err) {
    await refundCredits(userId, cost, "script_to_scenes_refund");
    await db.generation.update({
      where: { id: gen.id },
      data: {
        status: "failed",
        error: String(err?.message ?? err).slice(0, 500),
      },
    });
    return NextResponse.json(
      { error: "Script generation failed" },
      { status: 502 }
    );
  }
}

/** Parse script into individual scenes with prompts */
function parseScriptIntoScenes(scriptText) {
  const scenes = [];

  // Split by common scene markers (SCENE, VIDEO:, etc.)
  const sceneRegex = /(?:SCENE\s+\d+:|VIDEO:|===+)(.*?)(?=(?:SCENE\s+\d+:|VIDEO:|===+|$))/gis;
  const matches = [...scriptText.matchAll(sceneRegex)];

  matches.forEach((match, index) => {
    const sceneContent = match[1].trim();

    // Extract VIDEO description
    const videoMatch = sceneContent.match(/VIDEO:\s*(.+?)(?:\n|NARRATION|$)/i);
    const videoDesc = videoMatch ? videoMatch[1].trim() : "Scene " + (index + 1);

    // Extract NARRATION
    const narrationMatch = sceneContent.match(/NARRATION:\s*(.+?)(?:\n|TIMING|$)/is);
    const narration = narrationMatch ? narrationMatch[1].trim() : "";

    // Extract TIMING
    const timingMatch = sceneContent.match(/TIMING:\s*(.+?)(?:\n|EFFECTS|$)/i);
    const timing = timingMatch ? timingMatch[1].trim() : "5s";

    // Extract EFFECTS
    const effectsMatch = sceneContent.match(/EFFECTS:\s*(.+?)$/is);
    const effects = effectsMatch ? effectsMatch[1].trim() : "";

    // Create a prompt for video generation
    const videoPrompt = `${videoDesc}. ${narration} ${effects}`.trim();

    if (videoPrompt.length > 20) {
      scenes.push({
        order: index + 1,
        videoPrompt: videoPrompt,
        description: videoDesc,
        narration: narration,
        timing: timing,
        effects: effects,
      });
    }
  });

  return scenes.length > 0 ? scenes : parseScriptIntoScenesAlt(scriptText);
}

/** Alternative parsing for different script formats */
function parseScriptIntoScenesAlt(scriptText) {
  const scenes = [];
  const lines = scriptText.split('\n').filter(l => l.trim());

  let currentScene = null;
  let sceneCount = 0;

  for (const line of lines) {
    if (line.match(/^(SCENE|VIDEO|SHOT)[\s:]/i)) {
      if (currentScene && currentScene.prompt.length > 20) {
        scenes.push(currentScene);
      }
      sceneCount++;
      currentScene = {
        order: sceneCount,
        videoPrompt: line.replace(/^(SCENE|VIDEO|SHOT)[\s:]/i, '').trim(),
        description: line,
        narration: "",
        timing: "5s",
        effects: "",
      };
    } else if (currentScene && line.trim().length > 10) {
      currentScene.prompt = (currentScene.prompt || "") + " " + line;
    }
  }

  if (currentScene && currentScene.prompt?.length > 20) {
    scenes.push(currentScene);
  }

  return scenes;
}
