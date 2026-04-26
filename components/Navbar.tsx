import Link from "next/link";
import SearchBar from "./SearchBar";
import { Suspense } from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-bg/70 backdrop-blur-lg border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accentDim grid place-items-center text-white text-sm font-bold shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
            A
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline">
            <span className="text-white">Ani</span>
            <span className="text-accent">Stream</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-1 text-sm">
          <NavLink href="/" label="Home" />
          <NavLink href="/search?q=trending" label="Discover" />
          <NavLink href="/search?q=new" label="New Releases" />
        </nav>

        <div className="flex-1 flex justify-end items-center gap-3">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>

          <button
            aria-label="Notifications"
            className="hidden sm:grid w-9 h-9 place-items-center rounded-full hover:bg-panel transition-colors text-muted hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accentDim grid place-items-center text-white text-sm font-semibold ring-2 ring-bg">
            U
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-md text-muted hover:text-white hover:bg-panel transition-colors font-medium"
    >
      {label}
    </Link>
  );
}
