import Link from "next/link";
import SearchBar from "./SearchBar";
import { Suspense } from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-accent">Ani</span>
          <span className="text-white">Stream</span>
        </Link>
        <nav className="hidden md:flex gap-4 text-sm text-muted">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
        </nav>
        <div className="flex-1" />
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
    </header>
  );
}
