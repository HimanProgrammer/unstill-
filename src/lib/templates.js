// ---------------------------------------------------------------------------
// PROMPT TEMPLATES — curated starting points, in the spirit of the template
// galleries other AI generation tools ship (Runway, Pika, InVideo, Midjourney,
// etc.). Pure data: pick one to prefill the prompt (and mode) in Quick Create
// or a Studio scene. Add more here — nothing else needs to change.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Template
 * @property {string} id
 * @property {string} label
 * @property {string} [blurb]
 * @property {"image"|"video"} mode
 * @property {string} category
 * @property {string} prompt
 */

/** @type {Template[]} */
export const TEMPLATES = [
  // -------------------------------- VIDEO ---------------------------------
  {
    id: "drone-reveal",
    label: "Cinematic drone reveal",
    blurb: "Rising shot over a landscape",
    mode: "video",
    category: "Cinematic",
    prompt: "A slow, rising drone shot revealing a dramatic landscape at golden hour, cinematic color grade, gentle camera drift",
  },
  {
    id: "city-timelapse",
    label: "City night timelapse",
    blurb: "Skyline lights streaking below",
    mode: "video",
    category: "Cinematic",
    prompt: "A timelapse of a city skyline at night, light trails from traffic streaking below, stars slowly moving overhead",
  },
  {
    id: "cinematic-establishing",
    label: "Establishing shot",
    blurb: "Wide shot opening a scene",
    mode: "video",
    category: "Cinematic",
    prompt: "A wide cinematic establishing shot slowly pushing in on a location at dusk, anamorphic lens flare, film grain",
  },
  {
    id: "slow-motion-splash",
    label: "Slow-motion splash",
    blurb: "Liquid frozen mid-motion",
    mode: "video",
    category: "Cinematic",
    prompt: "An ultra slow-motion shot of liquid splashing and freezing mid-air, dramatic studio lighting, dark background",
  },

  {
    id: "product-hero",
    label: "Product hero spin",
    blurb: "360° turntable on a product",
    mode: "video",
    category: "Product",
    prompt: "A slow 360-degree turntable shot of a sleek product on a reflective studio surface, soft studio lighting, shallow depth of field",
  },
  {
    id: "product-unbox",
    label: "Unboxing reveal",
    blurb: "Hands opening packaging",
    mode: "video",
    category: "Product",
    prompt: "A close-up shot of hands unboxing a premium product, soft top-down lighting, satisfying slow reveal, shallow depth of field",
  },
  {
    id: "packaging-float",
    label: "Floating packaging",
    blurb: "Product floats in studio void",
    mode: "video",
    category: "Product",
    prompt: "A product package gently floating and rotating in a minimalist studio void, soft gradient background, subtle particles drifting",
  },

  {
    id: "food-macro",
    label: "Food macro close-up",
    blurb: "Steam rising off fresh food",
    mode: "video",
    category: "Food",
    prompt: "An extreme macro shot of steam rising off freshly cooked food, shallow focus, warm kitchen lighting, slow motion",
  },
  {
    id: "food-pour",
    label: "Sauce pour shot",
    blurb: "Sauce drizzling in slow motion",
    mode: "video",
    category: "Food",
    prompt: "A slow-motion macro shot of sauce being drizzled over food, rich color, shallow depth of field, studio lighting",
  },
  {
    id: "coffee-pour",
    label: "Coffee pour overhead",
    blurb: "Coffee poured from above",
    mode: "video",
    category: "Food",
    prompt: "An overhead slow-motion shot of coffee being poured into a cup, steam rising, warm morning light through a window",
  },

  {
    id: "walk-through",
    label: "Character walk-through",
    blurb: "Tracking shot down an alley",
    mode: "video",
    category: "Character",
    prompt: "A cinematic tracking shot following a character walking through a neon-lit rain-soaked alley at night",
  },
  {
    id: "hero-turn",
    label: "Hero turnaround",
    blurb: "Character turns to face camera",
    mode: "video",
    category: "Character",
    prompt: "A slow-motion shot of a character turning to face the camera, dramatic backlighting, dust particles in the air, cinematic",
  },
  {
    id: "talking-head",
    label: "Talking-head intro",
    blurb: "Person speaking to camera",
    mode: "video",
    category: "Character",
    prompt: "A person standing in a well-lit modern room, speaking directly to the camera, natural gestures, soft key light, shallow depth of field",
  },

  {
    id: "nature-macro",
    label: "Nature macro bloom",
    blurb: "A flower blooming, up close",
    mode: "video",
    category: "Nature",
    prompt: "A time-lapse macro shot of a flower blooming, soft natural light, shallow depth of field, dew drops on petals",
  },
  {
    id: "ocean-waves",
    label: "Ocean waves aerial",
    blurb: "Waves seen from above",
    mode: "video",
    category: "Nature",
    prompt: "An aerial drone shot slowly panning over turquoise ocean waves crashing onto a sandy beach, golden hour light",
  },
  {
    id: "forest-light",
    label: "Forest light rays",
    blurb: "Sunbeams through the canopy",
    mode: "video",
    category: "Nature",
    prompt: "A slow tracking shot through a misty forest with sunbeams streaming through the canopy, dust motes floating in the light",
  },

  {
    id: "ugc-selfie",
    label: "UGC selfie-style clip",
    blurb: "Handheld phone-style talking clip",
    mode: "video",
    category: "Social",
    prompt: "A handheld selfie-style video of a person talking casually to the camera in natural daylight, authentic UGC look, slight camera shake",
  },
  {
    id: "day-in-life",
    label: "Day-in-the-life montage",
    blurb: "Quick lifestyle b-roll clip",
    mode: "video",
    category: "Social",
    prompt: "A quick lifestyle b-roll clip following someone through their morning routine, natural light, candid documentary style",
  },
  {
    id: "unboxing-ugc",
    label: "UGC product reaction",
    blurb: "Authentic reaction to a product",
    mode: "video",
    category: "Social",
    prompt: "A candid, phone-shot style clip of someone reacting genuinely while trying a new product for the first time, natural indoor lighting",
  },

  {
    id: "real-estate-flythrough",
    label: "Real estate fly-through",
    blurb: "Smooth glide through a home",
    mode: "video",
    category: "Real Estate",
    prompt: "A smooth interior fly-through of a modern, sunlit living room, gliding camera movement, real estate showcase style",
  },
  {
    id: "property-aerial",
    label: "Property aerial reveal",
    blurb: "Drone reveal of a house",
    mode: "video",
    category: "Real Estate",
    prompt: "A cinematic drone shot rising to reveal a beautiful house and its surrounding property at golden hour",
  },

  {
    id: "fashion-runway",
    label: "Fashion runway walk",
    blurb: "Model walking toward camera",
    mode: "video",
    category: "Fashion",
    prompt: "A model walking confidently down a runway toward the camera, dramatic spotlighting, fabric flowing in slow motion",
  },
  {
    id: "fabric-closeup",
    label: "Fabric texture close-up",
    blurb: "Fabric rippling in the wind",
    mode: "video",
    category: "Fashion",
    prompt: "An extreme close-up of fine fabric rippling gently in a breeze, soft studio lighting, shallow depth of field",
  },

  {
    id: "car-reveal",
    label: "Car showroom reveal",
    blurb: "Car unveiled under studio light",
    mode: "video",
    category: "Automotive",
    prompt: "A cinematic showroom reveal of a car under dramatic studio lighting, slow camera orbit, reflections gliding across the paint",
  },
  {
    id: "road-drive",
    label: "Scenic road drive",
    blurb: "Car driving a coastal road",
    mode: "video",
    category: "Automotive",
    prompt: "A tracking shot of a car driving along a scenic coastal road at sunset, cinematic color grade, smooth camera motion",
  },

  {
    id: "gadget-float",
    label: "Tech gadget showcase",
    blurb: "Device rotates with UI glow",
    mode: "video",
    category: "Tech",
    prompt: "A sleek tech gadget slowly rotating in a dark studio with glowing UI light accents, futuristic product showcase style",
  },
  {
    id: "circuit-macro",
    label: "Circuit board macro",
    blurb: "Extreme close-up of tech detail",
    mode: "video",
    category: "Tech",
    prompt: "An extreme macro shot of a glowing circuit board, shallow depth of field, futuristic blue and purple lighting",
  },

  {
    id: "travel-montage",
    label: "Travel destination montage",
    blurb: "Sweeping shots of a destination",
    mode: "video",
    category: "Travel",
    prompt: "A sweeping cinematic montage of a scenic travel destination, mixing drone shots and street-level views, warm golden light",
  },
  {
    id: "street-market",
    label: "Bustling street market",
    blurb: "Handheld walk through a market",
    mode: "video",
    category: "Travel",
    prompt: "A handheld walking shot through a colorful, bustling street market, vibrant colors, candid documentary energy",
  },

  {
    id: "sports-action",
    label: "Sports action freeze",
    blurb: "Athlete mid-action, slow-mo",
    mode: "video",
    category: "Sports",
    prompt: "A dramatic slow-motion shot of an athlete mid-action, sweat flying, dynamic low-angle camera, stadium lights in the background",
  },

  {
    id: "wedding-moment",
    label: "Wedding first look",
    blurb: "Emotional candid moment",
    mode: "video",
    category: "Wedding",
    prompt: "A soft, warm cinematic shot of a couple's first look moment at a wedding, golden hour backlighting, shallow depth of field",
  },

  {
    id: "explainer-abstract",
    label: "Abstract explainer background",
    blurb: "Flowing shapes for voiceover",
    mode: "video",
    category: "Explainer",
    prompt: "Smooth, flowing abstract 3D shapes in brand colors gently morphing, clean minimal background suitable for a voiceover explainer",
  },
  {
    id: "data-viz-motion",
    label: "Data visualization motion",
    blurb: "Animated charts and graphs",
    mode: "video",
    category: "Explainer",
    prompt: "A clean animated data visualization with bars and lines rising smoothly, minimal modern UI style, soft gradient background",
  },

  // -------------------------------- IMAGE ---------------------------------
  {
    id: "product-studio",
    label: "Studio product shot",
    blurb: "Clean seamless product photo",
    mode: "image",
    category: "Product",
    prompt: "A minimalist studio product photo on a seamless white background, soft diffused lighting, subtle reflection, commercial photography",
  },
  {
    id: "product-lifestyle",
    label: "Lifestyle product shot",
    blurb: "Product styled in real setting",
    mode: "image",
    category: "Product",
    prompt: "A lifestyle product photo styled on a wooden table with natural props around it, soft window light, shallow depth of field",
  },
  {
    id: "portrait-cinematic",
    label: "Cinematic portrait",
    blurb: "Moody dramatic lighting",
    mode: "image",
    category: "Portrait",
    prompt: "A cinematic portrait with dramatic Rembrandt lighting, shallow depth of field, moody color grade, 85mm lens look",
  },
  {
    id: "portrait-studio",
    label: "Studio headshot",
    blurb: "Clean professional headshot",
    mode: "image",
    category: "Portrait",
    prompt: "A clean professional studio headshot, soft even lighting, neutral gray background, sharp focus on the eyes",
  },
  {
    id: "landscape-epic",
    label: "Epic landscape",
    blurb: "Sweeping dramatic vista",
    mode: "image",
    category: "Landscape",
    prompt: "A sweeping epic landscape at sunrise, dramatic clouds, volumetric light rays, ultra-wide angle, highly detailed",
  },
  {
    id: "logo-concept",
    label: "Minimal logo concept",
    blurb: "Flat vector geometric mark",
    mode: "image",
    category: "Design",
    prompt: "A minimalist modern logo concept, flat vector style, bold geometric shapes, clean negative space, on a plain background",
  },
  {
    id: "isometric-scene",
    label: "Isometric scene",
    blurb: "Cute 3D miniature room",
    mode: "image",
    category: "Design",
    prompt: "A cute isometric 3D scene of a cozy room, soft pastel colors, tiny details, clean render, studio lighting",
  },
  {
    id: "app-ui-mockup",
    label: "App UI mockup",
    blurb: "Clean mobile app screen",
    mode: "image",
    category: "Design",
    prompt: "A clean modern mobile app UI mockup on a smartphone screen, minimal design, soft shadows, presented on a plain gradient background",
  },
  {
    id: "food-flatlay",
    label: "Food flat-lay",
    blurb: "Top-down styled table shot",
    mode: "image",
    category: "Food",
    prompt: "A top-down flat-lay food photography shot on a rustic wooden table, natural window light, styled ingredients around the plate",
  },
  {
    id: "food-hero",
    label: "Food hero plate",
    blurb: "Restaurant-style plated dish",
    mode: "image",
    category: "Food",
    prompt: "A restaurant-quality hero shot of a beautifully plated dish, dramatic side lighting, shallow depth of field, garnish detail visible",
  },
  {
    id: "fashion-lookbook",
    label: "Fashion lookbook shot",
    blurb: "Editorial style outfit photo",
    mode: "image",
    category: "Fashion",
    prompt: "An editorial fashion lookbook photo of a model in a stylish outfit, clean studio background, confident pose, soft directional light",
  },
  {
    id: "real-estate-interior",
    label: "Interior real estate photo",
    blurb: "Bright, styled living space",
    mode: "image",
    category: "Real Estate",
    prompt: "A bright, professionally styled interior real estate photo of a modern living room, wide angle, natural light, HDR look",
  },
  {
    id: "car-studio",
    label: "Car studio shot",
    blurb: "Showroom-style car photo",
    mode: "image",
    category: "Automotive",
    prompt: "A studio photo of a car under dramatic showroom lighting, reflective floor, three-quarter angle, high-end automotive photography",
  },
  {
    id: "gadget-render",
    label: "Tech product render",
    blurb: "Glossy 3D render on gradient",
    mode: "image",
    category: "Tech",
    prompt: "A glossy 3D render of a tech gadget floating on a soft gradient background, studio lighting, product render style",
  },
  {
    id: "travel-postcard",
    label: "Travel postcard shot",
    blurb: "Iconic destination view",
    mode: "image",
    category: "Travel",
    prompt: "A vibrant postcard-style photo of an iconic travel destination at golden hour, wide angle, rich saturated colors",
  },
  {
    id: "social-thumbnail",
    label: "Social media thumbnail",
    blurb: "Bold eye-catching cover image",
    mode: "image",
    category: "Social",
    prompt: "A bold, high-contrast social media thumbnail image with a clear focal subject, vivid colors, clean composition for a video cover",
  },
];

export const TEMPLATE_CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))];

export function templatesFor(mode) {
  return TEMPLATES.filter((t) => t.mode === mode);
}
