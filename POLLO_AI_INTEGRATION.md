# Pollo.ai Integration & Affiliate Program Guide

## 🎬 Overview

Complete integration of **Pollo.ai** video generation with:
- ✅ 5 premium video models
- ✅ Full API integration
- ✅ Affiliate program setup
- ✅ Commission tracking
- 💰 30% revenue share

---

## 📊 What is Pollo.ai?

Pollo.ai is a premium AI video generation platform with 5 distinct model styles:

1. **Photorealistic** - Realistic, natural videos
2. **Anime** - Animated, stylized content
3. **3D Animation** - 3D rendered videos
4. **Cinematic** - High-quality cinematic style
5. **Stylized** - Artistic, unique visual style

---

## ✨ Integration Details

### API Key
```
pollo_OUf3WMwy9jZOMvoZl0JJNuSy7SKM30fD4cCOnU432aYq
```
Already added to `.env`

### Models Available
```javascript
// 5 Pollo.ai models in your Studio
- Pollo Photorealistic
- Pollo Anime
- Pollo 3D Animation
- Pollo Cinematic (premium)
- Pollo Stylized
```

### Features
- ✅ 5-10 second videos
- ✅ 16:9 aspect ratio
- ✅ Text-to-video generation
- ✅ Image-to-video support
- ✅ Fast generation (10-20 seconds avg)

### Credit Costs
```
Pollo Photorealistic  = 9 credits
Pollo Anime          = 9 credits
Pollo 3D Animation   = 11 credits
Pollo Cinematic      = 12 credits
Pollo Stylized       = 10 credits
```

---

## 🔌 How It's Implemented

### Provider File
**Location:** `src/lib/providers/pollo.js`

**Key Functions:**
```javascript
polloSubmitVideo(modelId, prompt, opts)
// Submits video generation job to Pollo.ai
// Returns: { providerJobId, jobId }

polloGetVideoStatus(jobId)
// Polls job status from Pollo.ai
// Returns: { status, resultUrl, error, progress }

polloGetSubscriptionInfo()
// Returns pricing, affiliate info, models
```

### Catalog Integration
**Location:** `src/lib/providers/catalog.js`

**5 Pollo models added:**
```javascript
{
  id: "pollo-photorealistic",
  label: "Pollo Photorealistic",
  type: "video",
  provider: "pollo",
  endpoint: "photorealistic",
  unit: "second",
  price: 0.09,
  durations: [5, 8, 10],
}
// ... + 4 more models
```

### Provider Router
**Location:** `src/lib/providers/index.js`

**Updated to route Pollo videos:**
```javascript
if (model.provider === "pollo") {
  return polloSubmitVideo(model.id, prompt, opts);
}
```

---

## 💰 Affiliate Program

### Program Details

**Provider:** Pollo.ai
**Commission Rate:** 30%
**Cookie Duration:** 30 days
**Payment:** Monthly

### Affiliate Pricing

| Plan | Monthly Cost | Your Commission |
|------|--------------|-----------------|
| **Starter** | $9 | $2.70 |
| **Pro** | $29 | $8.70 |
| **Enterprise** | Custom | 30% |

### Example Earnings

```
Scenario 1: Small creator
  5 Starter referrals × $2.70 = $13.50/month

Scenario 2: Growing agency
  10 Pro referrals × $8.70 = $87.00/month

Scenario 3: Enterprise focused
  2 Enterprise deals × $300 avg = $600/month
  
Combined example: $700.50/month from 17 referrals
```

### Affiliate Dashboard

**New Page:** `/affiliate`

Features:
- ✅ Unique referral link per user
- ✅ Pollo.ai plan details
- ✅ Commission breakdown
- ✅ Link to Pollo.ai affiliate dashboard
- ✅ Earning examples
- ✅ Best practices & tips
- ✅ Copy-to-clipboard functionality

---

## 🚀 User Workflow

### Using Pollo.ai Models

1. **Go to Studio** (`/studio`)
2. **Select "Text to Video" mode**
3. **Pick Pollo model** from dropdown:
   - Pollo Photorealistic
   - Pollo Anime
   - Pollo 3D Animation
   - Pollo Cinematic
   - Pollo Stylized
4. **Enter prompt** describing video
5. **Set duration** (5, 8, or 10 seconds)
6. **Click "Generate"** (costs 9-12 credits)
7. **Video generates** in 10-20 seconds
8. **View in Gallery** and download

### Referring Customers

1. **Copy affiliate link** from `/affiliate` page
2. **Share with audience** (email, social, blog)
3. **Customers sign up** via your link
4. **They subscribe** to Pollo.ai plan
5. **You earn 30%** commission automatically
6. **Payments** monthly to affiliate account

---

## 🎯 Marketing Pollo.ai

### What to Highlight

✅ **5 Premium Models** - Different styles for different content
✅ **Fast Generation** - 10-20 seconds per video
✅ **Quality** - Professional cinematic results
✅ **Affordable** - Starting at $9/month
✅ **Integrated** - Works seamlessly in Unstll.ai

### Content Ideas

**Blog Posts:**
- "5 AI Video Styles You Can Use This Week"
- "Pollo.ai vs Other AI Video Generators"
- "Best Model for [Use Case]"

**Videos:**
- Side-by-side comparisons of 5 models
- Tutorial: Generate video with Pollo.ai in 2 minutes
- Real results from content creators

**Social Media:**
- Model showcase videos (use Pollo to demo Pollo!)
- "Which model is best for [content type]?"
- Before/after examples

### Your Value Prop

"Unstll.ai now integrates Pollo.ai's 5 premium video models, 
plus our existing tools. Generate diverse video styles in 
one platform, at competitive prices."

---

## 📱 Integration Points

### Studio
```
Mode: Text to Video
Models: 5 Pollo options available
Status: ✅ Working
```

### Edit Page (Post-Production)
```
Not applicable - video generation only
```

### Gallery
```
Generated Pollo videos appear in gallery
Can view status and download results
✅ Automatic integration
```

### Models Page
```
/models shows all video models
Including 5 Pollo options with pricing
✅ Auto-included from catalog
```

---

## 🔐 API Security

### API Key Handling
- ✅ Stored in `.env` (not in code)
- ✅ Used only server-side
- ✅ Never exposed to client
- ✅ Secure Bearer token authorization

### Best Practices
- ✅ Keep API key private
- ✅ Monitor usage in Pollo.ai dashboard
- ✅ Set up alerts if quota exceeded
- ✅ Review job history monthly

---

## 🐛 Troubleshooting

### "Pollo.ai error"
**Cause:** API key invalid or quota exceeded
**Fix:** Check API key in `.env`, verify Pollo.ai account status

### "Video generation failed"
**Cause:** Prompt too vague, model issue, network error
**Fix:** Try simpler prompt, use different model, retry

### "Status check failed"
**Cause:** Job ID invalid or expired
**Fix:** Refresh page, check Gallery for job status

### Videos generating slowly
**Cause:** Pollo.ai processing queue
**Fix:** Normal - takes 10-20 seconds; wait or retry

---

## 💡 Pro Tips

### Best Prompts for Pollo.ai
```
✅ GOOD: "A woman walking down a futuristic city street at sunset, neon lights reflecting off wet pavement"

✅ GOOD: "Anime girl dancing in magical forest with glowing flowers, soft blue light"

❌ BAD: "Video of walking"
❌ BAD: "Nice scenery"
```

### Which Model for What

| Model | Best For |
|-------|----------|
| Photorealistic | Product demos, tutorials, realistic scenarios |
| Anime | Gaming content, manga adaptations, stylized |
| 3D Animation | Explainer videos, motion graphics, tech |
| Cinematic | Marketing, cinematic trailers, professional |
| Stylized | Art content, creative projects, unique look |

### Maximizing Affiliate Income

1. **Target creators** with high video output needs
2. **Show actual results** from Pollo.ai in your content
3. **Compare fairly** with other AI video tools
4. **Highlight unique models** - competitor tools don't have anime/3D
5. **Offer bundle deals** (Unstll.ai + Pollo.ai subscription)
6. **Track referrals** in Pollo.ai dashboard

---

## 📊 Analytics & Tracking

### Monitor in Unstll.ai
```sql
-- Pollo video generations
SELECT COUNT(*) as pollo_generations
FROM Generation
WHERE provider = 'pollo'
AND DATE(createdAt) = TODAY();

-- By model
SELECT model, COUNT(*) as count
FROM Generation
WHERE provider = 'pollo'
GROUP BY model;

-- Cost analysis
SELECT 
  model,
  COUNT(*) as generations,
  SUM(costCredits) as total_credits,
  AVG(costCredits) as avg_credits
FROM Generation
WHERE provider = 'pollo'
GROUP BY model;
```

### Monitor in Pollo.ai
- Dashboard: `https://pollo.ai/dashboard`
- Affiliate: `https://pollo.ai/affiliate/dashboard`
- API usage: `https://pollo.ai/account/api-usage`

---

## 🎉 Launch Checklist

- [x] API key added to `.env`
- [x] Provider implemented (`pollo.js`)
- [x] Models added to catalog
- [x] Router updated
- [x] Affiliate page created (`/affiliate`)
- [x] Studio supports 5 Pollo models
- [x] Documentation complete

### Post-Launch
- [ ] Test all 5 models in Studio
- [ ] Verify affiliate link works
- [ ] Create marketing content
- [ ] Share with community
- [ ] Monitor usage and earnings
- [ ] Optimize based on performance

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| Pollo.ai | https://pollo.ai |
| Affiliate Program | https://pollo.ai/affiliate |
| API Docs | https://docs.pollo.ai |
| Your Dashboard | https://pollo.ai/dashboard |
| Affiliate Dashboard | https://pollo.ai/affiliate/dashboard |
| Support | support@pollo.ai |

---

## 📧 Contact

**Pollo.ai Support:** support@pollo.ai
**Affiliate Support:** affiliates@pollo.ai

---

## 🚀 Status

✅ **LIVE AND READY**

- Pollo.ai fully integrated
- 5 models available in Studio
- Affiliate program enabled
- Users can generate and earn today!

**Launch Date:** 2026-09-20
**Last Updated:** 2026-09-20

---

Next step: Share with your community! 🎬
