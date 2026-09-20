# Free & Paid AI Video Generation APIs Integration Guide

## 🎬 Overview

Complete list of AI video generation APIs with:
- ✅ Free tier options
- 💳 Paid credit systems
- 🔌 Integration difficulty
- 💰 Cost comparison
- 📊 Quality ratings

## 📋 APIs Currently Integrated

### ✅ Already in Your App

| API | Model | Type | Status | Cost |
|-----|-------|------|--------|------|
| WaveSpeedAI | Kling, Veo, LTX, Luma, Sora | Aggregator | Active | Credits |
| PixVerse | PixVerse v5.5 | Native | Active | Credits |

---

## 🆓 FREE Tier APIs (Easy to Add)

### 1. **Hugging Face (Damo-VIDIT)**
- **What:** Text-to-video open source
- **Free Tier:** 2 videos/day
- **Quality:** Medium (lower than paid)
- **Speed:** Slow (30-60 seconds)
- **Setup:** 🟢 Very Easy
- **Cost Model:** Free tier + paid API
- **Endpoint:** `huggingface.co/spaces/...`
- **API Key:** HF token
- **Integration Time:** 30 minutes

**Pros:**
- Truly free option
- Open source
- No credit card required

**Cons:**
- Slow generation
- Lower quality
- Limited daily quota

### 2. **Stability Video (Free Preview)**
- **What:** High-quality video generation
- **Free Tier:** Limited credits monthly
- **Quality:** ⭐⭐⭐⭐⭐ (Excellent)
- **Speed:** Fast (10-20 seconds)
- **Setup:** 🟡 Medium
- **Cost Model:** Free tier + paid
- **API Key:** Stability account
- **Integration Time:** 1-2 hours

**Pros:**
- High quality
- Fast generation
- Smooth animations

**Cons:**
- Limited free tier
- Expensive at scale

### 3. **Runway Gen-2 (Free Plan)**
- **What:** Professional video generation
- **Free Tier:** 15 videos/month
- **Quality:** ⭐⭐⭐⭐⭐ (Professional)
- **Speed:** Medium (20-40 seconds)
- **Setup:** 🟡 Medium
- **Cost Model:** Free + paid tiers
- **API Key:** Runway API key
- **Integration Time:** 2 hours

**Pros:**
- Professional quality
- Generous free tier
- Good documentation

**Cons:**
- 15 videos/month limit
- Higher pricing
- Image-to-video main focus

### 4. **FFmpeg (Local/Free)**
- **What:** Local video processing
- **Free Tier:** ∞ (fully free)
- **Quality:** ⭐⭐⭐ (Depends on input)
- **Speed:** Fast (local processing)
- **Setup:** 🟡 Medium (server setup)
- **Cost Model:** Free (hosting only)
- **Integration Time:** 3-4 hours

**Pros:**
- Completely free
- No API costs
- Full control
- Unlimited usage

**Cons:**
- Not generative (processing only)
- Requires server resources
- No AI generation

---

## 💳 PAID APIs with Credit System

### Premium Tier (Best Quality)

#### **1. OpenAI (DALL-E Video)**
- **Status:** Coming soon (2024)
- **Quality:** ⭐⭐⭐⭐⭐
- **Speed:** Fast
- **Cost:** TBD (likely $0.10-0.50 per 5s)
- **Setup:** 🟢 Very Easy
- **Integration:** Already use OpenAI, extend it

```javascript
// Example integration
export async function generateVideoOpenAI(prompt, duration) {
  const response = await openai.images.createVideoGeneration({
    prompt: prompt,
    duration: duration,
    model: "dall-e-video"
  });
  return response.data[0].url;
}
```

#### **2. Google Veo 2**
- **Status:** In beta (Google Cloud)
- **Quality:** ⭐⭐⭐⭐⭐ (Excellent)
- **Speed:** Medium (30 seconds)
- **Cost:** ≈ $0.05 per 6-second video
- **Setup:** 🟡 Medium (Google Cloud setup)
- **Integration Time:** 2-3 hours
- **Credit Cost Suggestion:** 5-7 credits per video

```bash
# Setup
gcloud init
gcloud auth login
gcloud services enable videointelligence.googleapis.com
```

#### **3. Synthesia (Enterprise)**
- **Quality:** ⭐⭐⭐⭐⭐
- **Speed:** Fast (5-30 seconds)
- **Cost:** From $100/month enterprise
- **Setup:** 🔴 Hard (Enterprise only)
- **Avatar Support:** Yes
- **Use Case:** Corporate videos, avatars

#### **4. D-ID (Talking Avatar)**
- **Quality:** ⭐⭐⭐⭐
- **Speed:** Fast (10-20 seconds)
- **Cost:** $0.05-0.15 per video
- **Setup:** 🟡 Medium
- **Specialization:** Animated talking avatars
- **Credit Cost Suggestion:** 3-5 credits per video

---

### Mid-Tier APIs (Good Balance)

#### **5. Pika (Recently Acquired by ByteDance)**
- **Status:** Active & expanding
- **Quality:** ⭐⭐⭐⭐
- **Speed:** Fast (5-20 seconds)
- **Free Tier:** 100 monthly credits
- **Paid:** $10/month = 1000 credits
- **Setup:** 🟢 Easy
- **Integration Time:** 1-2 hours
- **Credit Cost Suggestion:** 10 credits per video

```javascript
// Pika API example
const response = await fetch('https://api.pika.art/videos', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${PIKA_API_KEY}` },
  body: JSON.stringify({
    prompt: 'A cinematic sunset shot',
    duration: 5,
    aspectRatio: '16:9'
  })
});
```

#### **6. Deforum Animate Diff (Free + Paid)**
- **Status:** Open source + commercial
- **Quality:** ⭐⭐⭐⭐
- **Speed:** Slow-Medium (local/cloud)
- **Cost:** Free (open source) + cloud API
- **Setup:** 🟡 Medium
- **Integration:** ComfyUI/Jupyter based

#### **7. Munch AI (Content Repurposing)**
- **Quality:** ⭐⭐⭐
- **Speed:** Fast
- **Specialty:** Long video → short clips
- **Cost:** Free trial + paid tiers
- **Setup:** 🟢 Easy
- **Use Case:** Social media clips from long videos

---

### Enterprise/Specialized

#### **8. Move AI (Motion Capture)**
- **Cost:** Custom enterprise
- **Quality:** ⭐⭐⭐⭐⭐
- **Use Case:** Realistic human animation
- **Setup:** 🔴 Hard (Enterprise)

#### **9. Limecraft (Auto Editing)**
- **Cost:** Enterprise
- **Specialty:** Auto-editing, transitions
- **Use Case:** Professional editing automation

---

## 🔄 Comparison Matrix

| API | Free Tier | Quality | Speed | Cost | Setup | Recommended |
|-----|-----------|---------|-------|------|-------|-------------|
| **WaveSpeedAI** | No | ⭐⭐⭐⭐⭐ | Fast | Credits | Easy | ✅ Using |
| **PixVerse** | No | ⭐⭐⭐⭐ | Medium | Credits | Easy | ✅ Using |
| Runway Gen-2 | ✅ (15/mo) | ⭐⭐⭐⭐⭐ | Medium | $$$$ | Medium | ✅ Add |
| Pika | ✅ (100 mo) | ⭐⭐⭐⭐ | Fast | $$ | Easy | ✅ Add |
| Google Veo 2 | No | ⭐⭐⭐⭐⭐ | Medium | $$ | Medium | ✅ Add |
| Stability Video | Limited | ⭐⭐⭐⭐⭐ | Fast | $$$ | Medium | ✅ Add |
| Hugging Face | ✅ (2/day) | ⭐⭐⭐ | Slow | Free | Easy | ✅ Easy win |
| D-ID | Limited | ⭐⭐⭐⭐ | Fast | $$ | Medium | Consider |

---

## 📊 Cost Breakdown (Per Video Generation)

| API | Cost per 5-10s Video | Your Credit Cost |
|-----|----------------------|------------------|
| WaveSpeedAI (current) | $0.10-0.20 | 10 |
| PixVerse (current) | $0.05-0.15 | 10 |
| Runway Gen-2 | $0.20-0.50 | 15-20 |
| Pika | $0.01-0.03 | 5 |
| Google Veo 2 | $0.05 | 7-8 |
| Stability Video | $0.15-0.30 | 12-15 |
| D-ID | $0.05-0.15 | 8-10 |
| Hugging Face | Free | 0-1 |

---

## 🚀 Top 3 Recommended Additions

### 1. **Pika (Easiest to Add)**
- ✅ Free tier available
- ✅ Fast API integration
- ✅ Good quality
- ✅ Low cost
- ⏱️ Integration: 1-2 hours

### 2. **Google Veo 2 (Best Quality)**
- ✅ Excellent quality
- ✅ Fast generation
- ✅ Google backing
- ✅ Reasonable pricing
- ⏱️ Integration: 2-3 hours

### 3. **Runway Gen-2 (Professional)**
- ✅ Professional quality
- ✅ Free tier (15/month)
- ✅ Well-documented
- ✅ Good for portfolio
- ⏱️ Integration: 2 hours

---

## 🔧 Implementation Strategy

### Phase 1: Add Pika (Week 1)
```javascript
// src/lib/providers/pika.js
export async function pikaapiSubmitVideo(prompt, opts) {
  const response = await fetch('https://api.pika.art/videos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PIKA_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      duration: opts.duration || 5,
      aspectRatio: '16:9'
    })
  });
  const data = await response.json();
  return { providerJobId: data.id };
}
```

### Phase 2: Add Google Veo 2 (Week 2)
```javascript
// src/lib/providers/google-veo.js
import { VideoServiceClient } from '@google-cloud/video-intelligence';

export async function googleVeoSubmitVideo(prompt, opts) {
  const client = new VideoServiceClient();
  const request = {
    parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1`,
    videoGenerationConfig: {
      prompt: prompt,
      duration: `${opts.duration}s`
    }
  };
  const response = await client.generateVideo(request);
  return { providerJobId: response.name };
}
```

### Phase 3: Add Runway (Week 3)
```javascript
// src/lib/providers/runway.js
import Runway from '@runwayml/api';

export async function runwaySubmitVideo(prompt, opts) {
  const runway = new Runway({
    token: process.env.RUNWAY_API_KEY
  });
  
  const task = await runway.createTask({
    taskType: 'gen3',
    promptText: prompt,
    duration: opts.duration || 5,
    aspectRatio: '16:9'
  });
  
  return { providerJobId: task.id };
}
```

---

## 📝 .env Updates Needed

```env
# Current
WAVESPEED_API_KEY=wsk_live_...
PIXVERSE_API_KEY=sk-...

# Add Pika
PIKA_API_KEY=pk_...
PIKA_API_BASE=https://api.pika.art

# Add Google Veo
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CREDENTIALS_PATH=/path/to/credentials.json

# Add Runway
RUNWAY_API_KEY=...
RUNWAY_API_BASE=https://api.runwayml.com

# Add Stability
STABILITY_API_KEY=...
STABILITY_API_BASE=https://api.stability.ai

# Add Hugging Face (optional)
HF_API_KEY=hf_...
HF_API_BASE=https://api-inference.huggingface.co
```

---

## 🎯 Updated Credit Costs

```javascript
// src/lib/credits.js
export const CREDIT_COST = {
  image: 1,
  video: 10,        // Standard
  video_pika: 5,    // Cheaper option
  video_veo: 8,     // Good balance
  video_runway: 15, // Premium
  script: 5,
};
```

---

## 🔌 Router Update

```javascript
// src/lib/providers/index.js
const videoProvider = {
  async submitVideo(prompt, opts) {
    const model = getModel(opts.model);
    
    if (model.provider === 'pika') {
      return pikaSubmitVideo(prompt, opts);
    }
    if (model.provider === 'veo') {
      return googleVeoSubmitVideo(prompt, opts);
    }
    if (model.provider === 'runway') {
      return runwaySubmitVideo(prompt, opts);
    }
    
    // Default to WaveSpeed
    return wavespeedSubmitVideo(model.id, prompt, opts);
  }
};
```

---

## 📚 Quick Integration Checklist

### For Each New API:
- [ ] Create provider file (`src/lib/providers/xxx.js`)
- [ ] Implement `submitVideo()` function
- [ ] Implement `getVideoStatus()` function
- [ ] Add API key to `.env.example`
- [ ] Update `CREDIT_COST` in `credits.js`
- [ ] Add models to `catalog.js`
- [ ] Add to provider router
- [ ] Test endpoint
- [ ] Document in README
- [ ] Update admin panel

---

## 🎬 Recommended First Additions

1. **Pika** - Easy, free tier, fast
2. **Google Veo 2** - Enterprise quality
3. **Runway** - Professional standard

This gives you:
- ✅ 3 different quality tiers
- ✅ Multiple free tier options
- ✅ Redundancy if one API goes down
- ✅ Options for different use cases
- ✅ Competitive feature set

---

## 💬 Why Add Multiple APIs?

1. **Redundancy** - If one goes down, users still generate
2. **Cost Optimization** - Choose cheapest for each use case
3. **Quality Options** - Users pick quality vs speed
4. **Differentiation** - "5 AI video models" > "1 API"
5. **User Choice** - Let users try different styles
6. **Future-Proof** - If one provider changes pricing

---

**Next Steps:**
1. ✅ Get API keys for Pika, Veo 2, Runway
2. ✅ Implement Pika first (easiest)
3. ✅ Add to model catalog
4. ✅ Test generation workflow
5. ✅ Deploy and announce new options!

---

**Status:** Ready to implement 🚀
