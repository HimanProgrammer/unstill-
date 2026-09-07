"use client";

import { useState } from "react";

const PLANS = [
  { id: "starter", name: "Starter", credits: 100, price: "$9", blurb: "~100 images or 10 videos." },
  { id: "pro", name: "Pro", credits: 500, price: "$39", blurb: "~500 images or 50 videos.", featured: true },
];

export default function PricingPage() {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  async function buy(plan) {
    setError("");
    setBusy(plan);
    try {
      const res = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout");
        setBusy(null);
        return;
      }
      window.location.href = data.url; // Stripe-hosted checkout
    } catch {
      setError("Network error. Try again.");
      setBusy(null);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="py-4 text-center">
        <p className="eyebrow mb-3">Credits, not subscriptions</p>
        <h1 className="font-display text-3xl font-bold">Buy credits, use them whenever.</h1>
        <p className="mt-3 text-mute">Images cost 1 credit. Videos cost 10. Credits never expire.</p>
      </div>

      <div className="grid gap-5 pb-16 sm:grid-cols-2">
        {PLANS.map((p) => (
          <div key={p.id} className={`card p-6 ${p.featured ? "border-iris/50" : ""}`}>
            {p.featured && <p className="eyebrow mb-2">Best value</p>}
            <h2 className="font-display text-xl font-medium">{p.name}</h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              <span className="text-mute">/ {p.credits} credits</span>
            </div>
            <p className="mt-2 text-sm text-mute">{p.blurb}</p>
            <button className="btn-amber mt-6 w-full" disabled={busy === p.id} onClick={() => buy(p.id)}>
              {busy === p.id ? "Redirecting…" : `Buy ${p.credits} credits`}
            </button>
          </div>
        ))}
      </div>

      {error && <p className="pb-8 text-center text-sm text-bad">{error}</p>}
    </div>
  );
}
