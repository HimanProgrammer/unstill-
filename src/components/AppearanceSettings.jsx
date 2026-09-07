"use client";

import { useEffect, useState } from "react";

const THEMES = [
  { id: "nebula", label: "Nebula", blurb: "Violet → pink → amber (default)", colors: ["#7C5CFF", "#FF4D9D", "#FFB23E"] },
  { id: "ocean", label: "Ocean", blurb: "Blue → cyan → sky", colors: ["#2D82FF", "#22D3EE", "#38BDF8"] },
  { id: "forest", label: "Forest", blurb: "Green → lime → gold", colors: ["#22C55E", "#84CC16", "#FACC15"] },
  { id: "sunset", label: "Sunset", blurb: "Orange → rose → gold", colors: ["#F97316", "#F43F5E", "#FACC15"] },
  { id: "mono", label: "Monochrome", blurb: "Grayscale, no color accent", colors: ["#A1A1AA", "#D4D4D8", "#FAFAFA"] },
];

export function AppearanceSettings() {
  const [theme, setTheme] = useState("nebula");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "nebula";
    setTheme(saved);
  }, []);

  function applyTheme(id) {
    setTheme(id);
    localStorage.setItem("theme", id);
    if (id === "nebula") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", id);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Appearance</h1>
      <p className="mt-1 text-sm text-mute">Pick an accent theme for buttons, links, and highlights across the app.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => applyTheme(t.id)}
            className={`card relative p-5 text-left transition-colors ${
              theme === t.id ? "border-iris/60" : "hover:border-white/20"
            }`}
          >
            <div className="flex gap-2">
              {t.colors.map((c) => (
                <span key={c} className="h-8 w-8 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="mt-3 font-medium text-paper">{t.label}</p>
            <p className="text-xs text-mute">{t.blurb}</p>
            {theme === t.id && (
              <span className="absolute right-3 top-3 rounded-full bg-iris px-2 py-0.5 text-[10px] font-medium text-white">
                Active
              </span>
            )}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-mute">
        Saved to this browser only. Applies to buttons, links, and highlights — background art and photos are unaffected.
      </p>
    </div>
  );
}
