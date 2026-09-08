"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogoFull } from "@/components/Logo";

// useSearchParams() (for ?invite=CODE) requires a Suspense boundary above it
// for Next's static export step, even though this page is fully client-side.
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("invite");
  const [mode, setMode] = useState(inviteCode ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // The Google button is always visible. `hasGoogle` tracks whether the
  // provider is actually configured (GOOGLE_CLIENT_ID / SECRET in .env) so a
  // click before setup shows a helpful message instead of a broken redirect.
  const [hasGoogle, setHasGoogle] = useState(false);

  useEffect(() => {
    getProviders().then((p) => setHasGoogle(!!p?.google)).catch(() => {});
  }, []);

  // Stash an invite code from the URL as a short-lived cookie so the OAuth
  // sign-in callback (which never sees this page's query string) can redeem
  // it too — the credentials path below sends it directly in the request.
  useEffect(() => {
    if (inviteCode) document.cookie = `invite_code=${inviteCode}; path=/; max-age=900`;
  }, [inviteCode]);

  function googleSignIn() {
    if (!hasGoogle) {
      setError("Google sign-in isn't configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env and restart.");
      return;
    }
    signIn("google", { callbackUrl: "/dashboard" });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, inviteCode: inviteCode ?? undefined }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Could not create account");
          setBusy(false);
          return;
        }
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Wrong email or password");
        setBusy(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link href="/" className="mx-auto mb-8">
        <LogoFull width={190} className="shadow-glow" />
      </Link>

      {inviteCode && (
        <div className="mb-4 rounded-lg border border-iris/40 bg-iris/10 px-4 py-3 text-center text-sm text-paper">
          🎉 You've been invited to beta test — sign up to get bonus credits.
        </div>
      )}

      <div className="card p-6">
        <h1 className="font-display text-2xl font-medium">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-mute">
          {mode === "signup"
            ? inviteCode
              ? "New accounts get 20 free credits, plus your invite bonus."
              : "New accounts get 20 free credits."
            : "Welcome back."}
        </p>

        <button
          type="button"
          onClick={googleSignIn}
          className="btn-ghost mt-6 w-full"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
          </svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-mute">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm text-mute">Name</label>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm text-mute">Email</label>
            <input
              className="field" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-mute">Password</label>
            <input
              className="field" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="text-sm text-bad">{error}</p>}

          <button className="btn-amber w-full" disabled={busy}>
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
          className="mt-4 text-sm text-mute hover:text-paper"
        >
          {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
