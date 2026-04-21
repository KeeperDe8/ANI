import Link from "next/link";
import type { AnimeSummary } from "@/lib/types";
import { displayTitle } from "@/lib/types";

export default function AnimeCard({ anime }: { anime: AnimeSummary }) {
  const title = displayTitle(anime.title);
  const img = anime.image || anime.cover;
  return (
    <Link
      href={`/anime/${anime.id}`}
      prefetch
      className="group block w-[160px] shrink-0"
    >
      <div className="aspect-[2/3] rounded-md overflow-hidden bg-panel border border-border group-hover:border-accent transition-colors">
        {img ? (
          // Using plain <img> — Consumet returns AniList CDN URLs, no need for Next/Image optimization
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted text-xs">No image</div>
        )}
      </div>
      <div className="mt-2 text-sm line-clamp-2 leading-tight group-hover:text-accent transition-colors">
        {title}
      </div>
      {anime.totalEpisodes ? (
        <div className="text-xs text-muted mt-0.5">{anime.totalEpisodes} ep</div>
      ) : null}
    </Link>
  );
}
