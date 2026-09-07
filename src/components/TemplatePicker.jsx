"use client";

import { useState, useRef, useEffect } from "react";
import { templatesFor } from "@/lib/templates";

// Small "Templates" popover — pick a preset prompt to prefill a generator.
export function TemplatePicker({ mode, onPick, label = "Templates" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const templates = templatesFor(mode);

  useEffect(() => {
    if (!open) return;
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-mute transition-colors hover:border-iris/60 hover:text-paper"
      >
        ✦ {label}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-lg border border-white/10 bg-panel/95 p-2 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-mute">
            {mode === "video" ? "Video templates" : "Image templates"}
          </p>
          <div className="max-h-72 overflow-y-auto">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { onPick(t); setOpen(false); }}
                className="block w-full rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white/[0.06]"
              >
                <span className="text-paper">{t.label}</span>
                <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-mute">{t.category}</span>
                <p className="mt-0.5 line-clamp-1 text-xs text-mute">{t.prompt}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
