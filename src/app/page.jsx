import Link from "next/link";
import { Logo, LogoFull } from "@/components/Logo";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* Top bar */}
      <header className="flex items-center justify-between py-6">
        <Logo />
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/models" className="text-mute transition-colors hover:text-paper">Models</Link>
          <Link href="/pricing" className="text-mute transition-colors hover:text-paper">Pricing</Link>
          <Link href="/login" className="btn-ghost py-1.5 text-sm">Sign in</Link>
        </nav>
      </header>

      {/* Hero — the thesis is the pipeline itself: prompt in, frame out. */}
      <section className="grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
        <div className="animate-fade-up">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-mute backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse-ring rounded-full bg-gradient-to-r from-iris to-pink" />
            Prompt &rarr; Frame &rarr; Reel
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.03] tracking-tight sm:text-6xl">
            A studio for<br />
            <span className="text-gradient-anim">generated</span> images<br className="hidden sm:block" /> and video.
          </h1>
          <p className="mt-6 max-w-md text-lg text-mute">
            Type what you want to see. Get a still from OpenAI or a moving
            clip from PixVerse — same workspace, same credits, one gallery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn-amber">Start with 20 free credits</Link>
            <Link href="/pricing" className="btn-ghost">See pricing</Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-xs text-mute">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-okay" /> No card required</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-iris" /> Credits never expire</span>
          </div>
        </div>

        {/* Signature element: the full unstill brand artwork in a lit frame. */}
        <div className="card animate-fade-up overflow-hidden [animation-delay:120ms]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono text-xs text-mute">
            <span className="h-2.5 w-2.5 rounded-full bg-bad" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn" />
            <span className="h-2.5 w-2.5 rounded-full bg-okay" />
            <span className="ml-2">unstill.brand</span>
          </div>
          <div className="group relative overflow-hidden bg-black p-6 sm:p-8">
            {/* moving sheen */}
            <div className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <LogoFull
              width={999}
              className="mx-auto w-full max-w-[420px] rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* How it works — a real sequence, so numbering is honest here. */}
      <section className="border-t border-white/10 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["01", "Write a prompt", "Describe the still or the shot. Add an image to animate it into video."],
            ["02", "We route it", "Images go to OpenAI, video to the PixVerse model of your choice."],
            ["03", "Collect the output", "Everything lands in your gallery, charged against your credit balance."],
          ].map(([n, h, p]) => (
            <div key={n} className="card p-6 transition-colors duration-300 hover:border-iris/40">
              <div className="font-mono text-2xl font-bold text-gradient">{n}</div>
              <h3 className="mt-3 font-display text-lg font-medium">{h}</h3>
              <p className="mt-2 text-sm text-mute">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-sm text-mute">
        unstill — a starter SaaS. Images by OpenAI, video by PixVerse.
      </footer>
    </main>
  );
}
