"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, LogoMark } from "@/components/Logo";
import { SignOutButton } from "@/components/SignOutButton";
import { FeedbackWidget } from "@/components/FeedbackWidget";

const NAV = [
  { href: "/dashboard", label: "Create", icon: SparkIcon },
  { href: "/studio", label: "Studio", icon: FilmIcon },
  { href: "/edit", label: "Edit", icon: WandIcon },
  { href: "/gallery", label: "Gallery", icon: GridIcon },
  { href: "/models", label: "Models", icon: LayersIcon },
  { href: "/pricing", label: "Billing", icon: CreditIcon },
  { href: "/settings", label: "Appearance", icon: PaletteIcon },
];

export function AppShell({ user, children }) {
  const pathname = usePathname();

  const items = user?.role === "admin"
    ? [...NAV, { href: "/admin", label: "Admin", icon: ShieldIcon }]
    : NAV;

  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 px-4 py-6 md:flex">
        <Link href="/dashboard" className="mb-8 px-2">
          <Logo />
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-white/[0.08] text-paper"
                    : "text-mute hover:bg-white/[0.04] hover:text-paper"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-amber" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
          <FeedbackWidget />
          <Link href="/pricing" className="block rounded-md bg-white/[0.04] px-3 py-2.5 text-sm">
            <span className="font-mono text-amber">{user?.credits ?? 0}</span>
            <span className="text-mute"> credits</span>
          </Link>
          <div className="flex items-center justify-between px-2">
            <span className="truncate text-xs text-mute" title={user?.email}>{user?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/10 bg-ink/90 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/dashboard"><LogoMark size={32} /></Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-mono text-amber">{user?.credits ?? 0}</span>
          <Link href="/studio" className="text-mute">Studio</Link>
          <Link href="/gallery" className="text-mute">Gallery</Link>
          <SignOutButton />
        </div>
      </div>

      <main className="min-w-0 flex-1 px-6 pb-16 pt-20 md:pt-8">{children}</main>
    </div>
  );
}

function SparkIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" strokeLinecap="round" />
    </svg>
  );
}
function FilmIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M3 15h18M8 4v16M16 4v16" />
    </svg>
  );
}
function GridIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" />
    </svg>
  );
}
function LayersIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 3l9 5-9 5-9-5 9-5Z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}
function CreditIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
      <path d="M2.5 10h19" />
    </svg>
  );
}
function WandIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M4 20 16 8" strokeLinecap="round" />
      <path d="M15 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2ZM20 9l.7 1.3 1.3.7-1.3.7-.7 1.3-.7-1.3L18 11l1.3-.7L20 9Z" />
    </svg>
  );
}
function PaletteIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.4-1.9-.3-.7 0-1.5.8-1.7A5 5 0 0 0 18 13c0-5.5-4-10-6-10Z" strokeLinejoin="round" />
      <circle cx="8" cy="10" r="1.2" /><circle cx="12" cy="7.5" r="1.2" />
      <circle cx="16" cy="10" r="1.2" /><circle cx="8.5" cy="14.5" r="1.2" />
    </svg>
  );
}
function ShieldIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
    </svg>
  );
}
