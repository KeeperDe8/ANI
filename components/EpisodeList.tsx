"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Episode } from "@/lib/types";
import { getProgress, progressPercent, type ProgressEntry } from "@/lib/progress";

export default function EpisodeList({
  animeId,
  episodes,
  currentEpisode,
  fallbackImage,
  variant = "grid",
}: {
  animeId: string;
  episodes: Episode[];
  currentEpisode?: number;
  fallbackImage?: string;
  variant?: "grid" | "compact";
}) {
  const [progressMap, setProgressMap] = useState<Record<number, ProgressEntry>>({});

  useEffect(() => {
    const map: Record<number, ProgressEntry> = {};
    for (const ep of episodes) {
      const p = getProgress(animeId, ep.number);
      if (p) map[ep.number] = p;
    }
    setProgressMap(map);
  }, [animeId, episodes]);

  if (!episodes?.length) {
    return <p className="text-muted text-sm">No episodes available.</p>;
  }

  if (variant === "compact") {
    return (
      <ul className="space-y-2">
        {episodes.map((ep) => {
          const active = currentEpisode === ep.number;
          const prog = progressMap[ep.number];
          const pct = prog ? progressPercent(prog) : 0;
          return (
            <li key={ep.id}>
              <Link
                href={`/watch/${animeId}/${ep.number}`}
                prefetch={active || ep.number < 6}
                className={`flex gap-3 p-2 rounded-lg border transition-colors ${
                  active
                    ? "bg-accent/10 border-accent/40"
                    : "bg-panel border-border hover:border-borderHover"
                }`}
              >
                <div className="relative w-24 aspect-video rounded-md overflow-hidden bg-panel2 shrink-0">
                  {ep.image || fallbackImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ep.image || fallbackImage}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  {pct > 0 ? (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40">
                      <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <div className={`text-xs font-semibold ${active ? "text-accent" : "text-muted"}`}>
                    Episode {ep.number}
                  </div>
                  <div className="text-sm font-medium line-clamp-2 mt-0.5">
                    {ep.title || `Episode ${ep.number}`}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {episodes.map((ep) => {
        const active = currentEpisode === ep.number;
        const prog = progressMap[ep.number];
        const pct = prog ? progressPercent(prog) : 0;
        return (
          <li key={ep.id}>
            <Link
              href={`/watch/${animeId}/${ep.number}`}
              prefetch={active || ep.number < 6}
              className="group block"
            >
              <div
                className={`relative aspect-video rounded-lg overflow-hidden bg-panel border transition-colors ${
                  active ? "border-accent" : "border-border group-hover:border-accent/60"
                }`}
              >
                {ep.image || fallbackImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ep.image || fallbackImage}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-panel2" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-accent/90 grid place-items-center backdrop-blur-sm shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                  <span className="text-xs font-semibold bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5">
                    EP {ep.number}
                  </span>
                </div>
                {pct > 0 ? (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                    <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                ) : null}
              </div>
              <div className="mt-2 text-sm font-medium line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                {ep.title || `Episode ${ep.number}`}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
