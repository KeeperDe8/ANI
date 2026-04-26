"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProgress, progressPercent, type ProgressEntry } from "@/lib/progress";

type EpStub = { number: number; title?: string; image?: string };

export default function DetailHeroActions({
  animeId,
  episodes,
  animeTitle,
  animeImage,
  animeCover,
  totalEpisodes,
}: {
  animeId: string;
  episodes: EpStub[];
  animeTitle: string;
  animeImage?: string;
  animeCover?: string;
  totalEpisodes?: number;
}) {
  const [progress, setProgress] = useState<ProgressEntry | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getProgress(animeId));
    try {
      const list = JSON.parse(localStorage.getItem("ani:watchlist") || "[]");
      setInWatchlist(list.includes(animeId));
    } catch {}
  }, [animeId]);

  const firstEp = episodes[0];
  const continueEp = progress
    ? episodes.find((e) => e.number === progress.episodeNumber)
    : undefined;

  const watchHref = continueEp
    ? `/watch/${animeId}/${continueEp.number}`
    : firstEp
    ? `/watch/${animeId}/${firstEp.number}`
    : `#`;

  const toggleWatchlist = () => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem("ani:watchlist") || "[]");
      const next = list.includes(animeId)
        ? list.filter((x) => x !== animeId)
        : [...list, animeId];
      localStorage.setItem("ani:watchlist", JSON.stringify(next));
      setInWatchlist(!inWatchlist);
    } catch {}
  };

  const share = () => {
    if (typeof navigator === "undefined") return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ title: animeTitle, url }).catch(() => {});
    } else if (navigator.clipboard && url) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  // Suppress hydration mismatch by rendering neutral state until mounted
  const showContinue = mounted && !!progress && !!continueEp;
  const pct = progress ? progressPercent(progress) : 0;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {firstEp ? (
        <Link
          href={watchHref}
          className="relative inline-flex items-center gap-2 bg-accent hover:bg-accentHover text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-accent/30 overflow-hidden"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
          {showContinue ? `Continue Episode ${progress!.episodeNumber}` : "Watch Now"}
          {showContinue ? (
            <span
              className="absolute bottom-0 left-0 h-1 bg-white/40 transition-all"
              style={{ width: `${pct}%` }}
            />
          ) : null}
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 bg-panel border border-border text-muted font-semibold px-6 py-3 rounded-full">
          No episodes yet
        </span>
      )}

      <button
        onClick={toggleWatchlist}
        className={`inline-flex items-center gap-2 backdrop-blur-md border font-semibold px-6 py-3 rounded-full transition-colors ${
          inWatchlist
            ? "bg-accent/20 border-accent/50 text-accent"
            : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
        }`}
      >
        {inWatchlist ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
      </button>

      <button
        onClick={share}
        aria-label="Share"
        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold px-4 py-3 rounded-full transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
    </div>
  );
}
