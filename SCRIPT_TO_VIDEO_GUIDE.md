# Script to Scenes Video Generator

## 🎬 Overview

A complete workflow for converting a single reference video into a multi-scene video project:

1. **Upload reference video** → Analyze it
2. **Generate script** from video using GPT-4 Vision
3. **Parse script into scenes** with individual prompts
4. **Select video generation model** (Pixverse, WaveSpeed, etc.)
5. **Auto-generate videos** for each scene

## ✨ Features

### Step 1: Video Analysis & Script Generation
- Paste any video URL (MP4, streaming, etc.)
- Select target AI model for video generation
- 5 credits to generate script from reference video
- GPT-4 Vision analyzes video content
- Produces professional production script

### Step 2: Automatic Scene Parsing
- Script auto-parsed into individual scenes
- Each scene gets:
  - **Order** (Scene 1, 2, 3, etc.)
  - **Video Prompt** (text for video generation)
  - **Description** of the visual content
  - **Narration** (voiceover text)
  - **Timing** (duration in seconds)
  - **Effects** (suggested visual effects)

### Step 3: Multi-Video Generation
- One-click generation of all scenes
- Each scene gets its own video generation job
- 10 credits per video (standard cost)
- Parallel processing for speed
- Track generation status per scene

## 📍 Location

**Navigate to:** Edit → "Script to Scenes" tab

## 🚀 How to Use

### Basic Workflow

1. **Go to Edit page**
   ```
   /edit
   ```

2. **Click "Script to Scenes" tab**

3. **Enter video URL**
   - YouTube (download as MP4 first)
   - Vimeo
   - Direct MP4 link
   - AWS S3 video
   - Any publicly accessible video

4. **Select video model**
   - Pixverse v5.5 (recommended for quality)
   - LTX (for fast generation)
   - Kling, Luma, Sora, etc.

5. **Click "Analyze Video & Generate Script"**
   - Costs 5 credits
   - Takes 5-15 seconds
   - Analyzes video content
   - Generates professional script

6. **Review generated script**
   - See full production script
   - Option to copy script
   - Option to start over

7. **Review parsed scenes**
   - View all extracted scenes
   - Check video prompts
   - Verify timing and narration
   - Adjust if needed (copy to notepad, re-paste)

8. **Click "Generate Videos"**
   - Costs 10 credits × number of scenes
   - Example: 5 scenes = 50 credits
   - All videos queued for generation
   - Jobs appear in Gallery with tracking

## 📊 Pricing

| Step | Credits | Notes |
|------|---------|-------|
| Script Generation | 5 | Per reference video |
| Video Generation | 10 | Per scene/video |
| Example: 5 scenes | 55 total | 5 (script) + 50 (5×10) |

## 📋 Script Format

Generated scripts follow this structure:

```
SCENE 1: Opening
VIDEO: Wide shot of landscape at sunset
NARRATION: "As the sun sets over the horizon..."
TIMING: 5s
EFFECTS: Slow zoom, warm color grade

SCENE 2: Main Action
VIDEO: Close-up of subject in motion
NARRATION: "The action unfolds with..."
TIMING: 8s
EFFECTS: Dynamic camera movement

SCENE 3: Conclusion
VIDEO: Return to wide shot
NARRATION: "And so concludes..."
TIMING: 5s
EFFECTS: Fade to black
```

## 🔍 Scene Parsing Details

### How Scenes Are Extracted

1. **Automatic detection** of scene markers:
   - "SCENE 1:", "SCENE 2:", etc.
   - "VIDEO:", "SHOT:", etc.
   - Custom formatting

2. **Field extraction**:
   - VIDEO → describes visual content
   - NARRATION → voiceover text
   - TIMING → duration (converted to seconds)
   - EFFECTS → visual effects suggestions

3. **Video prompt creation**:
   - Combines description + narration + effects
   - Optimized for AI video generation
   - Ready for model submission

### Scene Matching

Scenes are matched if:
- ✅ Contains clear visual description
- ✅ Prompt length > 20 characters
- ✅ Extractable from script structure

## 🎯 Use Cases

### 1. **Interview to Multi-Scene Video**
- Upload interview footage
- Generate script analyzing key moments
- Parse into talking head → reaction shots → b-roll
- Generate complementary videos
- Edit together final output

### 2. **Product Demo to Tutorial Series**
- Analyze product demo video
- Generate step-by-step tutorial script
- Create individual videos for each step
- Assemble into educational series

### 3. **Social Content Expansion**
- Upload TikTok/Instagram viral video
- Generate script with hooks
- Parse into trending format scenes
- Generate similar videos in trending style

### 4. **Documentary Style Creation**
- Analyze nature/travel footage
- Generate cinematic script
- Create multi-scene documentary
- Automated b-roll generation

### 5. **Commercial Creation**
- Analyze brand/product video
- Generate persuasive script
- Create scene-by-scene commercial
- Maintain brand consistency

## ⚙️ Technical Details

### API Endpoint

**POST** `/api/tools/script-to-scenes`

```json
{
  "videoUrl": "https://example.com/video.mp4",
  "model": "pixverse-v5.5",
  "parseScenes": true
}
```

**Response:**
```json
{
  "generation": {
    "id": "gen_xyz",
    "type": "script",
    "status": "completed",
    "resultText": "PROFESSIONAL SCRIPT..."
  },
  "scenes": [
    {
      "order": 1,
      "videoPrompt": "Wide shot of landscape at sunset...",
      "description": "Opening wide shot",
      "narration": "As the sun sets...",
      "timing": "5s",
      "effects": "Slow zoom"
    },
    // ... more scenes
  ],
  "sceneCount": 5,
  "selectedModel": "pixverse-v5.5"
}
```

### Video Generation Flow

For each scene:
```
Scene prompt → POST /api/generate/video
  {
    "prompt": scene.videoPrompt,
    "model": selectedModel,
    "duration": parsedTiming
  }
→ Returns generation job ID
→ User can track in Gallery
→ Download when complete
```

## 💡 Pro Tips

### Best Reference Videos
- ✅ **Clear narration** - easier to transcribe
- ✅ **Distinct scenes** - easier to parse
- ✅ **HD quality** - better analysis
- ✅ **2-5 minutes** - optimal processing time
- ❌ Avoid: Unclear audio, unclear scene breaks

### Optimal Models for Different Content

| Content Type | Recommended Model | Why |
|--------------|-------------------|-----|
| Cinematic | Pixverse v5.5 | Best quality |
| Fast turnaround | LTX | Fastest generation |
| Realistic | Kling | Photorealistic output |
| Stylized | Veo | Artistic quality |

### Tips for Better Results

1. **Script Quality**
   - Clear, descriptive visual language
   - Specific about camera movements
   - Includes timing information
   - Mentions effects and transitions

2. **Scene Prompts**
   - Generated from script automatically
   - Contains visual description + narration
   - 30-150 words optimal
   - Specific camera/style details help

3. **Reference Video**
   - Professional production quality
   - Clear scene transitions
   - Consistent lighting/style
   - Identifiable key moments

## 🔧 Customization

### Edit Script Before Generating Videos

While script is displayed:
1. **Copy the script** (Copy Script button)
2. **Edit in text editor** if needed
3. **Go back and re-analyze** with corrected version
4. **Continue with modified script**

### Adjust Scene Timing

Scene timing extracted from:
- `TIMING: 5s` → 5 seconds
- `DURATION: 0-3 seconds` → 3 seconds
- Auto-clamped to 1-20 seconds (model limits)

Models support different durations:
- Pixverse: 2-10 seconds typically
- LTX: 1-10 seconds
- Adjust in model settings if needed

### Regenerate Individual Scenes

Users can:
1. Copy individual scene prompt
2. Go to Studio → Text to Video
3. Paste prompt manually
4. Generate individual video with different settings

## 📈 Workflow Variations

### Variation 1: Script Review Only
- Analyze video → Get script
- Review and copy script
- Use script for other purposes
- Don't generate videos if not needed

### Variation 2: Selective Generation
- Parse all scenes
- Only generate videos for favorite scenes
- Edit scene prompts before generation
- Mix generated + original footage

### Variation 3: Model Comparison
- Generate with Pixverse first
- Generate same scenes with LTX
- Compare outputs
- Edit with best versions

## 🐛 Troubleshooting

### "Script generation failed"
- Check video URL is public/accessible
- Verify video is playable in browser
- Ensure OpenAI API key valid
- Check account has GPT-4 Vision access

### "No scenes found"
- Script may have unusual formatting
- Scenes may not have clear markers
- Check script appears in script view
- Manually copy scenes and regenerate videos

### Videos failing to generate
- Check model supports selected duration
- Verify video prompts aren't too vague
- Ensure sufficient credits
- Check video generation API status

### Long processing time
- GPT-4 Vision takes 5-15 seconds
- Multiple video jobs queue sequentially
- 5 scenes × 10 seconds avg = ~50 seconds total
- Check Gallery for job progress

## 📱 Integration Points

### Studio Connection
- Users can copy generated script
- Use in Text to Video mode
- Reference video URLs available
- Models sync automatically

### Gallery Integration
- Generated videos appear automatically
- Can track status per scene
- Download when complete
- Organize into projects

### Edit Tools Integration
- Can use Video → Text on scene videos
- Add captions to generated videos
- Audio enhancement available
- Background removal available

## 🎨 Template Integration

Can be combined with Script Templates:
1. Pick "Script to Scenes" tool
2. Use template video URLs
3. Generate scripts from templates
4. Create consistent content
5. Maintain brand style

## 📚 Examples

### Example 1: 3-Scene Tutorial
**Reference:** Coding tutorial intro (2 min)
**Script Generated:** 3 clear scenes
**Scene 1:** Title screen with intro text
**Scene 2:** Code example walkthrough
**Scene 3:** Call-to-action outro
**Cost:** 5 (script) + 30 (3×10 videos) = 35 credits

### Example 2: 5-Scene Product Demo
**Reference:** Product unboxing video
**Script Generated:** 5 detailed scenes
**Scenes:** Intro → Feature 1 → Feature 2 → Testimonial → CTA
**Cost:** 5 (script) + 50 (5×10 videos) = 55 credits
**Time:** ~1-2 minutes total

## 🚀 Future Enhancements

- [ ] Edit scenes before generation
- [ ] Custom timing per scene
- [ ] Model selection per scene
- [ ] Scene duration presets
- [ ] Batch operations
- [ ] Project templates
- [ ] Auto-scene combining
- [ ] Subtitle extraction
- [ ] Music suggestions
- [ ] Export to editing software

---

**Status:** ✅ Production Ready

**First Launch:** Video Reference → Script → Scenes → Videos in one workflow!
