// Real preset names from veed/subtitles' schema — the kind of caption-style
// gallery InVideo/Kapwing-style tools ship (bold call-out, handwritten note,
// terminal/code look, etc.). Client-safe (no server env dependency) so both
// the API route and the Edit UI can import it directly.
export const CAPTION_PRESETS = [
  "simple", "plain", "glass", "whisper", "glide", "glide2", "fusion", "terminal",
  "handwritten", "backdrop", "backdrop2", "beans", "corpo", "boo", "shadeplay",
  "casper", "capri", "lowkey", "vinta", "diego", "ali", "slay", "kitty",
  "hustle", "karl", "sprout", "flex", "mint", "rizz", "vegas",
];
