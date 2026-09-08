"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Cycled gradient + icon tiles stand in for template thumbnails (no stock
// imagery on hand) — kept on-brand with the app's iris → pink → amber palette,
// with a simple icon per category so each card reads as a distinct "scene".
const LOOKS = {
  Cinematic: { gradient: "linear-gradient(160deg, #241a4a, #7C5CFF 60%, #34E0D8)", Icon: MountainIcon },
  Product: { gradient: "linear-gradient(160deg, #3a2410, #FFB23E 55%, #FF4D9D)", Icon: BottleIcon },
  Food: { gradient: "linear-gradient(160deg, #401826, #FF4D9D 55%, #FFB23E)", Icon: SteamIcon },
  Character: { gradient: "linear-gradient(160deg, #1a1030, #7C5CFF 55%, #FF4D9D)", Icon: PersonIcon },
  Nature: { gradient: "linear-gradient(160deg, #0f2e2a, #34E0D8 55%, #7C5CFF)", Icon: FlowerIcon },
  Social: { gradient: "linear-gradient(160deg, #331a3a, #FF4D9D 55%, #7C5CFF)", Icon: PhoneIcon },
  "Real Estate": { gradient: "linear-gradient(160deg, #1a2a3a, #34E0D8 55%, #FFB23E)", Icon: HouseIcon },
  Fashion: { gradient: "linear-gradient(160deg, #3a1a2e, #FF4D9D 55%, #FFB23E)", Icon: HangerIcon },
  Automotive: { gradient: "linear-gradient(160deg, #1a1a2e, #7C5CFF 55%, #34E0D8)", Icon: CarIcon },
  Tech: { gradient: "linear-gradient(160deg, #0f1a3a, #34E0D8 55%, #7C5CFF)", Icon: ChipIcon },
  Travel: { gradient: "linear-gradient(160deg, #1a3a3a, #34E0D8 55%, #FFB23E)", Icon: CompassIcon },
  Sports: { gradient: "linear-gradient(160deg, #3a2a10, #FFB23E 55%, #7C5CFF)", Icon: BoltIcon },
  Wedding: { gradient: "linear-gradient(160deg, #3a1a30, #FF4D9D 55%, #34E0D8)", Icon: RingIcon },
  Explainer: { gradient: "linear-gradient(160deg, #1a1a3a, #7C5CFF 55%, #FFB23E)", Icon: ChartIcon },
};

// Every template gets its own icon (not just its category's) so cards in the
// same category — e.g. three "Product" templates — still read as distinct.
// Templates now live in the DB (admin-editable) with generated ids, so this
// keys off the stable `label` instead; anything not listed (e.g. a template
// an admin adds later) falls back to its category's default icon above.
const ICON_BY_LABEL = {
  "Cinematic drone reveal": DroneIcon,
  "City night timelapse": SkylineIcon,
  "Establishing shot": ClapperIcon,
  "Slow-motion splash": DropletIcon,
  "Product hero spin": BottleIcon,
  "Unboxing reveal": BoxOpenIcon,
  "Floating packaging": BoxFloatIcon,
  "Food macro close-up": SteamIcon,
  "Sauce pour shot": DrizzleIcon,
  "Coffee pour overhead": CoffeeIcon,
  "Character walk-through": FootstepsIcon,
  "Hero turnaround": TurnArrowIcon,
  "Talking-head intro": MicIcon,
  "Nature macro bloom": FlowerIcon,
  "Ocean waves aerial": WaveIcon,
  "Forest light rays": TreeIcon,
  "UGC selfie-style clip": PhoneIcon,
  "Day-in-the-life montage": SunIcon,
  "UGC product reaction": StarBoxIcon,
  "Real estate fly-through": HouseIcon,
  "Property aerial reveal": DroneIcon,
  "Fashion runway walk": SpotlightIcon,
  "Fabric texture close-up": FabricIcon,
  "Car showroom reveal": CarIcon,
  "Scenic road drive": RoadIcon,
  "Tech gadget showcase": ChipIcon,
  "Circuit board macro": CircuitIcon,
  "Travel destination montage": CompassIcon,
  "Bustling street market": BasketIcon,
  "Sports action freeze": BoltIcon,
  "Wedding first look": RingIcon,
  "Abstract explainer background": ShapesIcon,
  "Data visualization motion": ChartIcon,
};

export function ProjectList({ initialProjects, initialTemplates }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [templates, setTemplates] = useState(initialTemplates ?? []);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const rowRef = useRef(null);
  const promptRef = useRef(null);

  function useTemplate(t) {
    setPrompt(t.prompt);
    promptRef.current?.focus();
    promptRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Templates are admin-editable now; re-fetch on mount so a change made in
  // Admin shows up without needing a fresh server render of this page.
  useEffect(() => {
    fetch("/api/templates?mode=video")
      .then((r) => r.json())
      .then((d) => d.templates && setTemplates(d.templates))
      .catch(() => {});
  }, []);

  async function createProject(initialPrompt, title) {
    setBusy(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) return;

      if (initialPrompt?.trim()) {
        const sceneRes = await fetch(`/api/projects/${data.project.id}/scenes`, { method: "POST" });
        const sceneData = await sceneRes.json();
        if (sceneRes.ok) {
          await fetch(`/api/projects/${data.project.id}/scenes/${sceneData.scene.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: initialPrompt.trim() }),
          });
        }
      }
      router.push(`/studio/${data.project.id}`);
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject(id) {
    setProjects((p) => p.filter((x) => x.id !== id));
    await fetch(`/api/projects/${id}`, { method: "DELETE" }).catch(() => {});
  }

  function scrollRow(dir) {
    rowRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium">Studio</h1>
        <button className="btn-amber text-sm" onClick={() => createProject()} disabled={busy}>
          {busy ? "Creating…" : "+ New blank project"}
        </button>
      </div>

      {/* Hero prompt bar */}
      <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-iris/25 via-pink/20 to-amber/20 p-1">
        <div className="flex items-center gap-3 rounded-lg bg-ink/70 p-3 backdrop-blur">
          <input
            ref={promptRef}
            className="flex-1 bg-transparent px-2 text-paper outline-none placeholder:text-mute"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && prompt.trim()) createProject(prompt); }}
            placeholder="Create a launch video for…"
          />
          <button
            className="btn-amber py-2 text-sm"
            disabled={!prompt.trim() || busy}
            onClick={() => createProject(prompt)}
          >
            Create video
          </button>
        </div>
      </div>

      {/* Template row */}
      <div className="relative mt-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-mute">Start from a template</p>
            <p className="mt-0.5 text-xs text-mute">Picking one fills the prompt above — edit it before creating.</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => scrollRow(-1)}
              className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-mute hover:text-paper"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={() => scrollRow(1)}
              className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-mute hover:text-paper"
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>

        <div ref={rowRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth">
          {templates.map((t) => {
            const look = LOOKS[t.category] ?? LOOKS.Cinematic;
            const Icon = ICON_BY_LABEL[t.label] ?? look.Icon;
            return (
              <button
                key={t.id}
                onClick={() => useTemplate(t)}
                disabled={busy}
                className="group w-52 shrink-0 text-left"
              >
                <div
                  className="relative flex aspect-[16/11] items-center justify-center overflow-hidden rounded-xl transition-transform group-hover:-translate-y-1 group-hover:shadow-glow"
                  style={{ background: look.gradient }}
                >
                  <Icon className="h-12 w-12 text-white/85" />
                  <span className="absolute left-2 top-2 rounded-full bg-black/35 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur">
                    {t.category}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-paper">{t.label}</p>
                <p className="line-clamp-1 text-xs text-mute">{t.blurb}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent projects */}
      <div className="mt-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-mute">Recent projects</p>
        {projects.length === 0 ? (
          <div className="card p-10 text-center text-mute">
            <p>No projects yet — start above with a prompt or template.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/studio/${p.id}`}
                className="card group relative block p-5 transition-colors hover:border-iris/50"
              >
                <p className="font-display text-lg font-medium">{p.title}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-mute">
                  {p._count.scenes} scene{p._count.scenes === 1 ? "" : "s"}
                </p>
                <p className="mt-3 text-xs text-mute">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </p>
                <button
                  onClick={(e) => { e.preventDefault(); deleteProject(p.id); }}
                  className="absolute right-3 top-3 hidden text-xs text-mute hover:text-bad group-hover:block"
                >
                  Delete
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MountainIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 18l6-9 4 5.5 2-3L21 18H3Z" strokeLinejoin="round" />
      <circle cx="17" cy="6" r="2" />
    </svg>
  );
}
function BottleIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M10 2h4M10 2v4l-2.5 3.5A3 3 0 0 0 7 11.5V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8.5a3 3 0 0 0-.5-1.7L14 6V2" strokeLinejoin="round" />
    </svg>
  );
}
function SteamIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M8 3c0 1.5-1.5 1.5-1.5 3S8 7.5 8 9M13 3c0 1.5-1.5 1.5-1.5 3S13 7.5 13 9" strokeLinecap="round" />
      <path d="M4 11h16l-1.2 8.4a2 2 0 0 1-2 1.6H7.2a2 2 0 0 1-2-1.6L4 11Z" strokeLinejoin="round" />
    </svg>
  );
}
function PersonIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="12" cy="7" r="3.2" />
      <path d="M5 21c0-4 3.2-6.5 7-6.5s7 2.5 7 6.5" strokeLinecap="round" />
    </svg>
  );
}
function FlowerIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 4a2.4 2.4 0 0 1 0 4.8A2.4 2.4 0 0 1 12 4ZM12 15.2a2.4 2.4 0 0 1 0 4.8 2.4 2.4 0 0 1 0-4.8ZM4 12a2.4 2.4 0 0 1 4.8 0A2.4 2.4 0 0 1 4 12ZM15.2 12a2.4 2.4 0 0 1 4.8 0 2.4 2.4 0 0 1-4.8 0Z" />
      <path d="M12 17v3" strokeLinecap="round" />
    </svg>
  );
}
function PhoneIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18h2" strokeLinecap="round" />
    </svg>
  );
}
function HouseIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M4 11l8-7 8 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v10h12V10" strokeLinejoin="round" />
      <path d="M10 20v-6h4v6" strokeLinejoin="round" />
    </svg>
  );
}
function HangerIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="12" cy="4" r="1.5" />
      <path d="M12 5.5v2M4 20l8-6 8 6M2 20h20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CarIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M4 16V12l2-5h12l2 5v4" strokeLinejoin="round" />
      <rect x="2.5" y="16" width="19" height="3.5" rx="1" />
      <circle cx="7" cy="19.5" r="1.4" />
      <circle cx="17" cy="19.5" r="1.4" />
    </svg>
  );
}
function ChipIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" strokeLinecap="round" />
    </svg>
  );
}
function CompassIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-4 2 2-6 4-2Z" strokeLinejoin="round" />
    </svg>
  );
}
function BoltIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />
    </svg>
  );
}
function RingIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="9" cy="15" r="4.2" />
      <circle cx="16" cy="15" r="4.2" />
      <path d="M12.5 6l-1.7 4M12.5 6l1.7 4" strokeLinecap="round" />
    </svg>
  );
}
function ChartIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DroneIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 6l3.5 3.5M18 6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5" strokeLinecap="round" />
      <circle cx="5" cy="5" r="1.6" /><circle cx="19" cy="5" r="1.6" />
      <circle cx="5" cy="19" r="1.6" /><circle cx="19" cy="19" r="1.6" />
    </svg>
  );
}
function SkylineIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 20V9l4-3v14M9 20V6l4-3v17M15 20V11l3-2 3 2v9" strokeLinejoin="round" />
      <path d="M2 20h20" strokeLinecap="round" />
    </svg>
  );
}
function ClapperIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 9.5 20 6l.8 3.9L4 13.5Z" strokeLinejoin="round" />
      <rect x="3" y="10" width="18" height="10" rx="1.2" />
      <path d="M6 8.5l2 3M11 7.7l2 3M16 6.9l2 3" strokeLinecap="round" />
    </svg>
  );
}
function DropletIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11Z" strokeLinejoin="round" />
    </svg>
  );
}
function BoxOpenIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 8l9-4 9 4-9 4-9-4Z" strokeLinejoin="round" />
      <path d="M3 8v9l9 4 9-4V8M12 12v9" strokeLinejoin="round" />
    </svg>
  );
}
function BoxFloatIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="6" y="8" width="12" height="10" rx="1.2" />
      <path d="M6 12h12M2 20c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" strokeLinecap="round" />
    </svg>
  );
}
function DrizzleIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M9 3v6M9 3c1.5 1 1.5 2.5 0 3.5" strokeLinecap="round" />
      <path d="M6 12c0-1.5 1.5-2 3-2s3 .5 3 2-1.5 2-3 2-3-.5-3-2Z" />
      <path d="M4 21c1-4 3-6 8-6s7 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
function CoffeeIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" strokeLinejoin="round" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 6c0-1 1-1 1-2M11 6c0-1 1-1 1-2" strokeLinecap="round" />
    </svg>
  );
}
function FootstepsIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <ellipse cx="8" cy="7" rx="2" ry="3" />
      <ellipse cx="16" cy="13" rx="2" ry="3" />
      <ellipse cx="8" cy="19" rx="2" ry="3" />
    </svg>
  );
}
function TurnArrowIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20c0-3.3 2.7-5.5 6-5.5" strokeLinecap="round" />
      <path d="M17 14l3 2-3 2M20 16h-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MicIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" strokeLinecap="round" />
    </svg>
  );
}
function WaveIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M2 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" strokeLinecap="round" />
      <path d="M2 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" strokeLinecap="round" />
    </svg>
  );
}
function TreeIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M12 2 7 10h3l-4 6h4v6h4v-6h4l-4-6h3L12 2Z" strokeLinejoin="round" />
    </svg>
  );
}
function SunIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" strokeLinecap="round" />
    </svg>
  );
}
function StarBoxIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="4" y="10" width="16" height="10" rx="1.2" />
      <path d="M4 10l8-6 8 6" strokeLinejoin="round" />
      <path d="M12 12.5l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3Z" strokeLinejoin="round" />
    </svg>
  );
}
function SpotlightIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M9 2h6l3 8H6l3-8Z" strokeLinejoin="round" />
      <circle cx="12" cy="18" r="3.2" />
    </svg>
  );
}
function FabricIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round" />
      <path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round" />
      <path d="M3 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round" />
    </svg>
  );
}
function RoadIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M8 21 10 3M16 21 14 3" strokeLinecap="round" />
      <path d="M12 3v2M12 9v2M12 15v2" strokeLinecap="round" />
    </svg>
  );
}
function CircuitIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><circle cx="12" cy="12" r="2" />
      <path d="M8 6h8M6 8v8M18 8v8M8 18h8M10 10.5 8 8M14 10.5l2-2.5M10 13.5 8 16M14 13.5l2 2.5" strokeLinecap="round" />
    </svg>
  );
}
function BasketIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M4 9h16l-1.5 10a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 9Z" strokeLinejoin="round" />
      <path d="M8 9 9 4M16 9 15 4M9 13v4M15 13v4" strokeLinecap="round" />
    </svg>
  );
}
function ShapesIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="8" cy="8" r="4" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
      <path d="M13 5l4 8-8 0Z" strokeLinejoin="round" />
    </svg>
  );
}
