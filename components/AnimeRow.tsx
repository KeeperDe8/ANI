"use client";

import { useRef } from "react";
import type { AnimeSummary } from "@/lib/types";
import AnimeCard from "./AnimeCard";

export default function AnimeRow({
  title,
  subtitle,
  items,
  cardSize = "md",
}: {
  title: string;
  subtitle?: string;
  items: AnimeSummary[];
  cardSize?: "sm" | "md" | "lg";
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  if (!items?.length) return null;

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-muted mt-0.5">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex gap-1.5">
          <ScrollBtn dir="left" onClick={() => scrollBy(-600)} />
          <ScrollBtn dir="right" onClick={() => scrollBy(600)} />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Left arrow overlay */}
        <button
          onClick={() => scrollBy(-600)}
          aria-label="Scroll left"
          className="absolute left-0 top-0 bottom-2 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-bg to-transparent opacity-0 hover:opacity-100 transition-opacity"
        >
          <span className="w-8 h-8 grid place-items-center rounded-full bg-panel border border-border shadow-lg text-muted hover:text-accent hover:border-accent transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </span>
        </button>

        <div
          ref={scrollerRef}
          className="px-4 lg:px-6 overflow-x-auto no-scrollbar scroll-smooth"
        >
          <div className="flex gap-4 pb-2">
            {items.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i).map((a) => (
              <AnimeCard key={a.id} anime={a} size={cardSize} />
            ))}
          </div>
        </div>

        {/* Right arrow overlay */}
        <button
          onClick={() => scrollBy(600)}
          aria-label="Scroll right"
          className="absolute right-0 top-0 bottom-2 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-bg to-transparent opacity-0 hover:opacity-100 transition-opacity"
        >
          <span className="w-8 h-8 grid place-items-center rounded-full bg-panel border border-border shadow-lg text-muted hover:text-accent hover:border-accent transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}

function ScrollBtn({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className="w-9 h-9 grid place-items-center rounded-full bg-panel border border-border hover:border-accent hover:bg-panel2 hover:text-accent text-muted transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
