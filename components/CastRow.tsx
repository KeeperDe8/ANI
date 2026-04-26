"use client";

import { useRef } from "react";
import type { Character } from "@/lib/types";
import { characterName } from "@/lib/types";

export default function CastRow({ characters }: { characters: Character[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  if (!characters?.length) return null;

  // Filter to characters with images (placeholder-free)
  const filtered = characters.filter((c) => c.image);
  if (!filtered.length) return null;

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-lg font-bold tracking-tight">Top Cast</h2>
        <div className="hidden md:flex gap-1.5">
          <button
            onClick={() => scrollBy(-400)}
            aria-label="Scroll left"
            className="w-8 h-8 grid place-items-center rounded-full bg-panel border border-border hover:border-accent hover:text-accent text-muted transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scrollBy(400)}
            aria-label="Scroll right"
            className="w-8 h-8 grid place-items-center rounded-full bg-panel border border-border hover:border-accent hover:text-accent text-muted transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="overflow-x-auto no-scrollbar">
        <div className="flex gap-4 pb-2">
          {filtered.slice(0, 16).map((c, i) => (
            <CastCard key={c.id ?? i} character={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CastCard({ character }: { character: Character }) {
  const name = characterName(character);
  const va = character.voiceActors?.find((v) =>
    v.language?.toLowerCase().includes("japan")
  ) || character.voiceActors?.[0];
  return (
    <div className="flex items-center gap-2.5 shrink-0 w-[180px]">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-panel2 border border-border shrink-0">
        {character.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold line-clamp-1">{name}</div>
        {va?.name?.full ? (
          <div className="text-xs text-muted line-clamp-1">{va.name.full}</div>
        ) : character.role ? (
          <div className="text-xs text-muted line-clamp-1 capitalize">
            {character.role.toLowerCase()}
          </div>
        ) : null}
      </div>
    </div>
  );
}
