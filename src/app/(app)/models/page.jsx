import { IMAGE_MODELS, VIDEO_MODELS } from "@/lib/providers/catalog";

function money(n) {
  // Trim trailing zeros but keep at least 2 decimals (e.g. $0.005, $0.04, $0.10).
  const s = n.toFixed(n < 0.01 ? 3 : 2);
  return `$${s}`;
}

function Row({ m }) {
  return (
    <div className="grid grid-cols-[1.6fr_0.8fr_1fr_1fr] items-center gap-4 border-t border-white/8 px-4 py-4 transition-colors hover:bg-white/[0.03]">
      <div className="flex items-center gap-2">
        <span className="font-medium text-paper">{m.label}</span>
        {m.note && (
          <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mute">
            {m.note}
          </span>
        )}
      </div>
      <div className="font-mono text-sm text-mute">{m.unit}</div>
      <div className="font-mono text-sm">
        <span className="text-paper">{money(m.price)}</span>
        <span className="text-mute">/{m.unit}</span>
      </div>
      <div className="font-mono text-sm text-mute">{m.outputPerDollar}</div>
    </div>
  );
}

function Table({ title, models }) {
  return (
    <section className="mb-12">
      <h2 className="mb-3 font-display text-xl font-medium">
        <span className="text-gradient">{title}</span>
      </h2>
      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1.6fr_0.8fr_1fr_1fr] gap-4 px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-mute">
          <div>Model</div>
          <div>Unit</div>
          <div>Price</div>
          <div>Output per $1</div>
        </div>
        {models.map((m) => (
          <Row key={m.id} m={m} />
        ))}
      </div>
    </section>
  );
}

export default function ModelsPage() {
  return (
    <div className="max-w-5xl">
      <div className="py-4">
        <p className="eyebrow mb-3">The model library</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Every model, one <span className="text-gradient-anim">workspace</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-mute">
          State-of-the-art generation with models from PixVerse, OpenAI, WaveSpeed, and more.
          Pick any of them right in the studio.
        </p>
      </div>

      <Table title="Image models" models={IMAGE_MODELS} />
      <Table title="Video models" models={VIDEO_MODELS} />

      <footer className="border-t border-white/10 py-8 text-sm text-mute">
        Prices reflect provider list pricing and may change. Verify current rates with your provider.
      </footer>
    </div>
  );
}
