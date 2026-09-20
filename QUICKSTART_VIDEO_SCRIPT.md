# Quick Start: Video Script Generation

## Setup (1 minute)

Make sure your `.env` has:
```
OPENAI_API_KEY=sk-...  # Must have GPT-4 Vision access
```

That's it! The database schema already supports script storage.

## Using the Feature

### In the UI

1. **Start the app**
   ```bash
   npm run dev
   ```

2. **Go to Studio** (`/studio`)

3. **Select "Video Script" tab**

4. **Paste a video URL**
   ```
   https://example.com/video.mp4
   ```

5. **Click "Generate — 5 credits"**

6. **Wait for script** (5-15 seconds typically)

7. **Click "Copy Script"** to copy to clipboard

### Via API (cURL)

```bash
curl -X POST http://localhost:3000/api/tools/video-script \
  -H "Content-Type: application/json" \
  -H "Cookie: __Secure-next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "videoUrl": "https://example.com/video.mp4"
  }'
```

**Response:**
```json
{
  "generation": {
    "id": "c...",
    "type": "script",
    "status": "completed",
    "resultText": "PROFESSIONAL VIDEO SCRIPT\n\nVIDEO: ...",
    "costCredits": 5
  }
}
```

## Example Video URLs to Test

Try these public videos:
- YouTube: `https://www.youtube.com/watch?v=...` (download MP4 first)
- Vimeo: Direct `.mp4` links
- AWS S3: Public bucket videos
- Any publicly accessible `.mp4` or video stream

## What the Script Includes

```
PROFESSIONAL VIDEO SCRIPT

SCENE 1: Opening
VIDEO: Wide shot of landscape
NARRATION: "As the sun rises over..."
TIMING: 0-3 seconds
EFFECTS: Slow zoom, warm color grade

SCENE 2: Main Content
VIDEO: Medium shot of subject
NARRATION: "This innovative approach..."
TEXT OVERLAY: "Key Point #1"
TIMING: 3-8 seconds
EFFECTS: Subtle pan, emphasis animation

[... continues for all scenes ...]
```

## Troubleshooting

### "Script generation failed"
- Check OPENAI_API_KEY is valid
- Verify video URL is publicly accessible
- Ensure account has GPT-4 Vision access (not free tier)

### "Not enough credits"
- Go to `/pricing` to buy credits
- Scripts cost 5 credits each

### Long wait time
- GPT-4 Vision takes 5-15 seconds per video
- Larger videos may take longer
- Don't close the browser tab during generation

## Database

Scripts are stored in the `Generation` table:

```sql
SELECT * FROM "Generation" 
WHERE type = 'script' 
ORDER BY createdAt DESC;
```

Each script record has:
- `id` - Unique generation ID
- `resultText` - The generated script
- `status` - "completed" or "failed"
- `costCredits` - Always 5
- `createdAt` - When it was generated

## Advanced: Customizing the Cost

To change the credit cost, edit `src/lib/credits.js`:

```javascript
export const CREDIT_COST = {
  image: 1,
  video: 10,
  script: 5,  // ← Change this number
};
```

Then restart the app.

## Advanced: Improving Script Quality

To get better scripts, customize the prompt in `src/lib/providers/openai.js`:

```javascript
export async function generateScriptFromVideoUrl(videoUrl) {
  const res = await client().chat.completions.create({
    // ... existing code ...
    content: [
      {
        type: "text",
        text: `Analyze this video and generate a detailed video script...
        // ← Customize this prompt for better results
        `,
      },
      // ...
    ],
  });
}
```

## What's Next?

Possible enhancements:
1. **Multi-frame extraction** - Extract frames at timestamps for more detailed analysis
2. **Script templates** - Pre-configured styles (Product Launch, Tutorial, Testimonial)
3. **Export formats** - PDF, DOCX, Markdown
4. **Scene breakdown** - Automatic scene segmentation
5. **TTS integration** - Generate voiceover audio
6. **AI editing** - Built-in script editor

## Support

For issues or questions:
1. Check `FEATURE_VIDEO_SCRIPT.md` for detailed documentation
2. Review error messages in browser console
3. Check OpenAI account status and usage
4. Verify database migrations (`npm run db:push`)
