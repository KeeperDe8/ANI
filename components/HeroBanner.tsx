"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { AnimeSummary } from "@/lib/types";
import { displayTitle } from "@/lib/types";

const ROTATE_MS = 7000;

export default function HeroBanner({ items }: { items: AnimeSummary[] }) {
  const slides = items.slice(0, 5);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(next, ROTATE_MS);
    return () => clearInterval(t);
  }, [next, paused, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-bg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-hero w-full">
        {slides.map((s, i) => (
          <Slide key={s.id} anime={s} active={i === active} />
        ))}

        {/* Bottom gradient (over all slides) */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent pointer-events-none" />
        {/* Left gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-transparent pointer-events-none" />

        {/* Pagination dots */}
        {slides.length > 1 ? (
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-8 bg-accent" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Slide({ anime, active }: { anime: AnimeSummary; active: boolean }) {
  const title = displayTitle(anime.title);
  const backdrop = anime.cover || anime.image;
  const desc = anime.description?.replace(/<[^>]*>/g, "") || "";

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!active}
    >
      {backdrop ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}

      {/* Content */}
      <div className="relative z-[1] h-full max-w-7xl mx-auto px-4 lg:px-6 flex items-end md:items-center pb-16 md:pb-0">
        <div className="max-w-2xl animate-slide-up">
          {anime.type ? (
            <div className="inline-block px-2.5 py-1 mb-4 rounded-md bg-accent/15 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider">
              {anime.type === "TV" ? "Series" : anime.type}
            </div>
          ) : null}

          <h1 className="hero-text text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 leading-[1.05]">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80 mb-4">
            {anime.releaseDate ? <span>{anime.releaseDate}</span> : null}
            {anime.releaseDate && (anime.totalEpisodes || anime.rating) ? (
              <span className="text-white/30">•</span>
            ) : null}
            {anime.totalEpisodes ? <span>{anime.totalEpisodes} Episodes</span> : null}
            {anime.totalEpisodes && anime.rating ? (
              <span className="text-white/30">•</span>
            ) : null}
            {anime.rating ? (
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                {(anime.rating / 10).toFixed(1)}
              </span>
            ) : null}
          </div>

          {desc ? (
            <p className="hero-text hidden md:block text-white/85 text-base leading-relaxed mb-6 line-clamp-3 max-w-xl">
              {desc}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/watch/${anime.id}/1`}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accentHover text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-accent/30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </Link>
            <Link
              href={`/anime/${anime.id}`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Add to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
