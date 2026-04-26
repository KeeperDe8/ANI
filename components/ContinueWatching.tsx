"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { listProgress, progressPercent, type ProgressEntry } from "@/lib/progress";

function formatRemaining(e: ProgressEntry): string {
  const remaining = Math.max(0, e.duration - e.currentTime);
  const m = Math.floor(remaining / 60);
  const s = Math.floor(remaining % 60);
  return `${m}:${s.toString().padStart(2, "0")} left`;
}

export default function ContinueWatching() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setEntries(listProgress());

    // Refresh when storage changes (other tabs)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ani:progress") setEntries(listProgress());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!mounted || !entries.length) return null;

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Continue Watching</h2>
          <p className="text-sm text-muted mt-0.5">Pick up where you left off</p>
        </div>
        <div className="hidden md:flex gap-1.5">
          <button
            onClick={() => scrollBy(-600)}
            aria-label="Scroll left"
            className="w-9 h-9 grid place-items-center rounded-full bg-panel border border-border hover:border-accent hover:text-accent text-muted transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scrollBy(600)}
            aria-label="Scroll right"
            className="w-9 h-9 grid place-items-center rounded-full bg-panel border border-border hover:border-accent hover:text-accent text-muted transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="max-w-7xl mx-auto px-4 lg:px-6 overflow-x-auto no-scrollbar snap-row"
      >
        <div className="flex gap-4 pb-2">
          {entries.map((e) => (
            <ContinueCard key={`${e.animeId}:${e.episodeNumber}`} entry={e} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContinueCard({ entry }: { entry: ProgressEntry }) {
  const pct = progressPercent(entry);
  const img = entry.episodeImage || entry.cover || entry.image;
  return (
    <Link
      href={`/watch/${entry.animeId}/${entry.episodeNumber}`}
      className="group block w-[300px] shrink-0"
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-panel border border-border group-hover:border-accent/60 transition-all">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-panel2" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play overlay */}
        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-accent/90 grid place-items-center backdrop-blur-sm shadow-xl">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Time remaining */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5 text-[11px] font-medium">
          {formatRemaining(entry)}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-2.5">
        <div className="text-sm font-semibold line-clamp-1 group-hover:text-accent transition-colors">
          {entry.title || "Untitled"}
        </div>
        <div className="text-xs text-muted mt-0.5">
          Episode {entry.episodeNumber}
          {entry.episodeTitle ? ` · ${entry.episodeTitle}` : ""}
        </div>
      </div>
    </Link>
  );
}
