"use client";

import { useEffect, useRef, useState } from "react";

function fmt(t) {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// A Premiere-style scrub timeline for a video/audio preview. When `allowTrim`
// is set, drag handles mark an in/out range and `onTrimChange({start,end})`
// fires — useful as a hint the caller can fold into a prompt, since none of
// our current AI tools accept a real trim/cut parameter server-side.
export function Timeline({ src, type = "video", allowTrim = false, onTrimChange }) {
  const mediaRef = useRef(null);
  const trackRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [trim, setTrim] = useState([0, 0]);
  const dragging = useRef(null); // "start" | "end" | "playhead" | null

  useEffect(() => {
    setDuration(0);
    setCurrent(0);
    setTrim([0, 0]);
  }, [src]);

  function onLoadedMetadata() {
    const d = mediaRef.current?.duration ?? 0;
    setDuration(d);
    setTrim([0, d]);
  }

  function seekTo(fraction) {
    const t = Math.max(0, Math.min(1, fraction)) * duration;
    if (mediaRef.current) mediaRef.current.currentTime = t;
    setCurrent(t);
  }

  function fractionFromEvent(e) {
    const rect = trackRef.current.getBoundingClientRect();
    return (e.clientX - rect.left) / rect.width;
  }

  function onTrackPointerDown(e) {
    if (!duration) return;
    dragging.current = "playhead";
    seekTo(fractionFromEvent(e));
  }

  function onHandlePointerDown(which) {
    return (e) => {
      e.stopPropagation();
      dragging.current = which;
    };
  }

  useEffect(() => {
    function onMove(e) {
      if (!dragging.current || !duration) return;
      const f = fractionFromEvent(e);
      const t = Math.max(0, Math.min(1, f)) * duration;
      if (dragging.current === "playhead") {
        seekTo(f);
      } else if (dragging.current === "start") {
        setTrim(([, end]) => {
          const next = [Math.min(t, end - 0.1), end];
          onTrimChange?.({ start: next[0], end: next[1] });
          return next;
        });
      } else if (dragging.current === "end") {
        setTrim(([start]) => {
          const next = [start, Math.max(t, start + 0.1)];
          onTrimChange?.({ start: next[0], end: next[1] });
          return next;
        });
      }
    }
    function onUp() { dragging.current = null; }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const playedPct = duration ? (current / duration) * 100 : 0;
  const trimStartPct = duration ? (trim[0] / duration) * 100 : 0;
  const trimEndPct = duration ? (trim[1] / duration) * 100 : 100;

  return (
    <div className="w-full">
      {type === "video" ? (
        <video
          ref={mediaRef}
          src={src}
          controls
          className="max-h-[220px] w-full rounded bg-black"
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        />
      ) : (
        <audio
          ref={mediaRef}
          src={src}
          controls
          className="w-full"
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        />
      )}

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-mute">
        <span>{fmt(current)}</span>
        {allowTrim && <span>Selected: {fmt(trim[0])} – {fmt(trim[1])}</span>}
        <span>{fmt(duration)}</span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onTrackPointerDown}
        className="relative mt-1 h-8 cursor-pointer rounded-md bg-white/[0.06]"
      >
        {/* Played progress */}
        <div className="absolute inset-y-0 left-0 rounded-md bg-iris/25" style={{ width: `${playedPct}%` }} />

        {/* Trim range shading */}
        {allowTrim && (
          <div
            className="absolute inset-y-0 border-x-2 border-amber bg-amber/15"
            style={{ left: `${trimStartPct}%`, width: `${trimEndPct - trimStartPct}%` }}
          />
        )}

        {/* Playhead */}
        <div className="absolute inset-y-0 w-0.5 bg-paper" style={{ left: `${playedPct}%` }} />

        {allowTrim && (
          <>
            <div
              onPointerDown={onHandlePointerDown("start")}
              className="absolute top-0 h-full w-2 -translate-x-1/2 cursor-ew-resize rounded bg-amber"
              style={{ left: `${trimStartPct}%` }}
            />
            <div
              onPointerDown={onHandlePointerDown("end")}
              className="absolute top-0 h-full w-2 -translate-x-1/2 cursor-ew-resize rounded bg-amber"
              style={{ left: `${trimEndPct}%` }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export { fmt as formatTime };
