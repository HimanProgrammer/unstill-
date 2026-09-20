# Script Templates Guide

Script templates are pre-configured video URLs that users can pick to quickly test script generation with common video types.

## ✅ Added Features

- Script template picker in Studio (same as video/image templates)
- Users can pick pre-made video URLs from templates
- Templates display in a popover with category and description

## 📋 Template Examples to Add in Admin

### In Admin > Templates, add these script templates:

#### 1. **Product Launch Demo**
- **Label**: Product Launch Demo
- **Category**: Product
- **Mode**: script
- **Prompt**: https://example.com/product-demo.mp4

#### 2. **Tutorial Series**
- **Label**: Coding Tutorial Intro
- **Category**: Education
- **Mode**: script
- **Prompt**: https://example.com/tutorial-intro.mp4

#### 3. **Social Media Content**
- **Label**: Trending TikTok Clip**
- **Category**: Social
- **Mode**: script
- **Prompt**: https://example.com/trending-clip.mp4

#### 4. **Documentary Style**
- **Label**: Nature Documentary Scene
- **Category**: Documentary
- **Mode**: script
- **Prompt**: https://example.com/nature-scene.mp4

#### 5. **Interview Format**
- **Label**: Influencer Interview
- **Category**: Interview
- **Mode**: script
- **Prompt**: https://example.com/interview-clip.mp4

#### 6. **Testimonial**
- **Label**: Customer Success Story
- **Category**: Marketing
- **Mode**: script
- **Prompt**: https://example.com/testimonial.mp4

#### 7. **Behind-the-Scenes**
- **Label**: BTS Studio Footage
- **Category**: BTS
- **Mode**: script
- **Prompt**: https://example.com/bts-footage.mp4

#### 8. **Unboxing Content**
- **Label**: Premium Product Unboxing
- **Category**: Unboxing
- **Mode**: script
- **Prompt**: https://example.com/unboxing.mp4

## 🎬 How Users Use Them

1. **Go to Studio**
2. **Select "Video Script" tab**
3. **Click "✦ Templates"** button
4. **Pick a template** (auto-fills with video URL)
5. **Click "Generate — 5 credits"**

## 🔧 What URLs Should Templates Include?

Templates can include:
- ✅ Direct MP4 links: `https://cdn.example.com/video.mp4`
- ✅ YouTube embeds: (download as MP4 first)
- ✅ Vimeo videos: `https://vimeo.com/123456`
- ✅ AWS S3 public videos
- ✅ Your own CDN videos

## 📊 Template Structure in Database

```javascript
{
  label: "Product Launch Demo",
  category: "Product",
  mode: "script",           // ← Important: must be "script"
  prompt: "https://...",    // ← Video URL goes in prompt field
  order: 1
}
```

## 🚀 How to Add Them

### Option 1: Via Admin UI
1. Go to `/admin` in your app
2. Click "Add template" button
3. Fill in the fields
4. Select **"script"** as Mode
5. Paste video URL in Prompt field
6. Save

### Option 2: Direct Database Insert
```sql
INSERT INTO Template (label, blurb, category, mode, prompt, order)
VALUES 
  ('Product Launch Demo', 'Analyze a product launch video', 'Product', 'script', 'https://example.com/product-demo.mp4', 1),
  ('Coding Tutorial Intro', 'Educational tutorial introduction', 'Education', 'script', 'https://example.com/tutorial.mp4', 2),
  ('Trending TikTok Clip', 'Social media trending content', 'Social', 'script', 'https://example.com/tiktok.mp4', 3),
  ('Nature Documentary', 'Documentary style nature footage', 'Documentary', 'script', 'https://example.com/nature.mp4', 4),
  ('Influencer Interview', 'Interview format content', 'Interview', 'script', 'https://example.com/interview.mp4', 5),
  ('Customer Testimonial', 'Success story and testimonials', 'Marketing', 'script', 'https://example.com/testimonial.mp4', 6),
  ('BTS Studio Footage', 'Behind-the-scenes content', 'BTS', 'script', 'https://example.com/bts.mp4', 7),
  ('Premium Unboxing', 'Product unboxing video', 'Unboxing', 'script', 'https://example.com/unboxing.mp4', 8);
```

## 💡 Pro Tips

### Create Template Categories
- **Product**: Product demos, launches, reviews
- **Education**: Tutorials, courses, explanations
- **Social**: TikTok, Instagram Reels, short-form
- **Interview**: Podcast clips, interviews, Q&A
- **Documentary**: Nature, travel, science
- **Marketing**: Testimonials, ads, promotions
- **BTS**: Behind-the-scenes, making-of
- **Unboxing**: Product unboxing, reviews

### Best Video URLs for Templates
- Use **stable, permanent URLs** (not time-limited)
- Host on your own CDN or trusted service
- Keep videos **under 2-5 minutes** for faster processing
- Use **high-quality footage** for better script generation
- Test URLs before adding to ensure they're accessible

## 🧪 Testing Script Templates

1. **Add 2-3 templates** via Admin
2. **Go to Studio**
3. **Select "Video Script" mode**
4. **Click "✦ Templates"**
5. **Pick a template** and verify it fills the URL field
6. **Generate a script** and check quality
7. **Refine templates** based on results

## 📈 Measuring Template Success

Track in your database:
```sql
-- Most used script templates
SELECT prompt, COUNT(*) as usage_count
FROM Generation
WHERE type = 'script'
GROUP BY prompt
ORDER BY usage_count DESC;
```

## 🎯 Next Steps

1. **Add script templates** in Admin
2. **Test template picker** in Studio
3. **Share with beta testers** for feedback
4. **Refine URLs** based on script quality
5. **Track usage** to identify popular categories

## 📝 Notes

- Templates use the same system as Image/Video templates
- Scripts use **video URLs** in the `prompt` field
- Categories help organize templates for users
- Order field controls template display order
- Users can still paste custom URLs (not just templates)

---

**Template Feature Status**: ✅ READY TO USE

You can now start adding script templates to your Admin panel!
