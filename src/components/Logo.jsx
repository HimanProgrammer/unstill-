// unstill brand logo, driven by the real artwork at /public/logo.png.
//
// The source PNG is a square lockup (U-mark on top, "unstill" wordmark + an
// IMAGE | VIDEO tagline below) on a black field. For compact placements we crop
// to just the U-mark via background-position and pair it with the wordmark as
// live text; LogoFull renders the whole artwork for hero/marketing spots.

export function LogoMark({ size = 40, className = "" }) {
  return (
    <span
      role="img"
      aria-label="unstill"
      className={`inline-block shrink-0 rounded-lg ring-1 ring-white/10 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: "#000",
        backgroundImage: "url(/logo.png)",
        backgroundRepeat: "no-repeat",
        // Zoom into and center on the U-mark (upper-middle of the square).
        backgroundSize: "188%",
        backgroundPosition: "47% 30%",
      }}
    />
  );
}

export function Logo({ size = 38, wordmark = true, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {wordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          <span className="text-paper">un</span>
          <span className="bg-gradient-to-r from-[#B6F03A] to-[#22E3D6] bg-clip-text text-transparent">
            still
          </span>
        </span>
      )}
    </span>
  );
}

// Full artwork (mark + wordmark + tagline) for hero / login / marketing.
export function LogoFull({ width = 180, className = "" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="unstill — image & video generation"
      width={width}
      height={width}
      className={`rounded-2xl ${className}`}
    />
  );
}
