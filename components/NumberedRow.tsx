"use client";

import { useRef } from "react";
import Link from "next/link";
import type { AnimeSummary } from "@/lib/types";
import { displayTitle } from "@/lib/types";

export default function NumberedRow({
  title,
  subtitle,
  items,
  max = 10,
}: {
  title: string;
  subtitle?: string;
  items: AnimeSummary[];
  max?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const top = items.slice(0, max);

  if (!top.length) return null;

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle ? <p className="text-sm text-muted mt-0.5">{subtitle}</p> : null}
        </div>
        <div className="flex gap-1.5">
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
        className="max-w-7xl mx-auto px-4 lg:px-6 overflow-x-auto no-scrollbar scroll-smooth"
      >
        <div className="flex gap-6 pb-2 pl-2">
          {top.map((a, i) => (
            <RankCard key={a.id} anime={a} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RankCard({ anime, rank }: { anime: AnimeSummary; rank: number }) {
  const title = displayTitle(anime.title);
  const img = anime.image || anime.cover;
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group flex items-end gap-2 shrink-0 w-[260px]"
    >
      <span
        className="font-display font-black leading-[0.85] text-transparent select-none transition-all"
        style={{
          fontSize: "120px",
          WebkitTextStroke: "2px rgba(139, 92, 246, 0.6)",
          letterSpacing: rank > 9 ? "-12px" : "0",
        }}
      >
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-panel border border-border group-hover:border-accent/60 transition-all w-[140px]">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-dim text-xs">
              No image
            </div>
          )}
          {anime.rating ? (
            <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-0.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>{(anime.rating / 10).toFixed(1)}</span>
            </div>
          ) : null}
        </div>
        <div className="mt-2 text-sm font-medium line-clamp-2 leading-tight group-hover:text-accent transition-colors w-[140px]">
          {title}
        </div>
        <div className="text-xs text-muted mt-0.5 w-[140px]">
          {anime.totalEpisodes ? `${anime.totalEpisodes} ep` : anime.type || ""}
        </div>
      </div>
    </Link>
  );
}
