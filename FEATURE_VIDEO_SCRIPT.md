# Video Script Generation Feature

## Overview
This feature allows users to generate professional video scripts by uploading a reference video URL. The system analyzes the video content using OpenAI's GPT-4 Vision API and generates a detailed, production-ready script.

## Files Added/Modified

### New Files
1. **`src/app/api/tools/video-script/route.js`**
   - API endpoint for video script generation
   - Validates video URL input
   - Manages credit spending and refunds
   - Stores generation in database

### Modified Files
1. **`src/lib/credits.js`**
   - Added `script: 5` to `CREDIT_COST` object
   - Video script generation costs 5 credits

2. **`src/lib/providers/openai.js`**
   - Added `generateScriptFromVideoUrl()` function
   - Uses GPT-4 Vision API to analyze video frames
   - Generates comprehensive production scripts
   - Includes alternative frame extraction logic for future enhancement

3. **`src/components/Studio.jsx`**
   - Added "Video Script" mode to the mode toggle
   - Added video URL input field
   - Updated `canGenerate` logic to handle script mode
   - Updated `generate()` function to handle script API calls
   - Enhanced `Output` component to display scripts with copy functionality
   - Updated status messages for script generation

## How It Works

### User Flow
1. User selects "Video Script" mode in the Studio
2. User enters a video URL
3. User clicks "Generate — 5 credits"
4. System:
   - Charges 5 credits to user account
   - Sends video URL to OpenAI GPT-4 Vision API
   - Receives and displays generated script
   - Stores result in database with type "script"

### Backend Flow
1. **API Request**: `/api/tools/video-script` POST
2. **Validation**: Checks URL format and user authentication
3. **Credit Check**: Verifies user has 5+ credits
4. **Script Generation**: Calls OpenAI GPT-4 Vision
5. **Database Update**: Stores result with status "completed" or "failed"
6. **Response**: Returns generation record with script text

### Credit System
- Cost: **5 credits** per video script generation
- Automatic refund on failure
- Credits deducted before API call to prevent double-charging

## API Endpoint

### POST `/api/tools/video-script`
```json
{
  "videoUrl": "https://example.com/video.mp4",
  "prompt": "Optional custom analysis prompt"
}
```

**Response (Success)**:
```json
{
  "generation": {
    "id": "cuid",
    "type": "script",
    "status": "completed",
    "resultText": "PROFESSIONAL VIDEO SCRIPT\n\nVIDEO: ...",
    "costCredits": 5,
    "createdAt": "2024-..."
  }
}
```

**Response (Insufficient Credits)**:
```json
{
  "error": "Not enough credits"
}
```
Status: `402 Payment Required`

## Generated Script Format

The script includes:
- Visual element descriptions
- Suggested narration/voiceover
- Timing cues for transitions
- Scene pacing recommendations
- Text overlay suggestions
- Visual effects recommendations

**Example Format**:
```
PROFESSIONAL VIDEO SCRIPT

VIDEO: Wide shot of city landscape at sunset
NARRATION: "As the sun sets over the city..."
DURATION: 3-5 seconds
EFFECTS: Slow zoom, color grade warmth

[Next Scene...]
```

## UI Features

### Mode Toggle
- "Text to Image" - Generate images from prompts
- "Text to Video" - Generate videos from prompts
- "Video Script" - Generate scripts from video URLs

### Video Script Specific UI
- Video URL input field with validation
- Real-time validation
- Status messages during processing
- Copy button for quick clipboard access
- Script display in monospace font

## Database
Uses existing `Generation` model:
- `type`: "script"
- `provider`: "openai"
- `model`: "gpt-4o"
- `resultText`: Contains generated script
- `status`: "queued" → "processing" → "completed" or "failed"

## Requirements
- **OpenAI API Key** required (uses GPT-4 Vision)
- Video must be accessible via public URL
- Supports all video formats that OpenAI's Vision API accepts

## Future Enhancements
1. **Video Frame Extraction**: Extract multiple frames at timestamps for more detailed analysis
2. **Multi-language Scripts**: Support script generation in different languages
3. **Template Picking**: Pre-configured script templates (e.g., "Product Launch", "Testimonial", "Tutorial")
4. **Script Editing**: In-app script editor with markdown support
5. **Export Formats**: PDF, DOCX, Markdown exports
6. **Scene Breakdown**: Automatic scene segmentation and timing
7. **AI Narration**: TTS integration for generated voiceover

## Testing

### Prerequisites
- Valid OpenAI API key with GPT-4 Vision access
- User with sufficient credits (5+)
- Publicly accessible video URL

### Test Steps
1. Navigate to Studio
2. Select "Video Script" mode
3. Paste a public video URL (e.g., from YouTube, Vimeo, etc.)
4. Click "Generate — 5 credits"
5. Wait for script to generate (typically 5-15 seconds)
6. Review script in output panel
7. Click "Copy Script" to copy to clipboard

### Example Video URLs to Test
- YouTube video embeds (may need direct MP4 link)
- Vimeo video URLs
- Direct MP4 links from CDN

## Troubleshooting

### "Script generation failed"
- Check OpenAI API key is valid
- Verify video URL is publicly accessible
- Check OpenAI account has GPT-4 Vision access

### "Not enough credits"
- User needs to purchase more credits from /pricing page
- Each script generation costs 5 credits

### Long processing time
- GPT-4 Vision processing can take 5-15 seconds
- Large videos may take longer
- Keep browser tab active during generation

## Cost Breakdown
- 5 credits = cost to user
- Actual OpenAI GPT-4 Vision API cost is variable
- Adjust credit cost in `src/lib/credits.js` if needed
