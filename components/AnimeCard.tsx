import Link from "next/link";
import type { AnimeSummary } from "@/lib/types";
import { displayTitle } from "@/lib/types";

export default function AnimeCard({
  anime,
  size = "md",
}: {
  anime: AnimeSummary;
  size?: "sm" | "md" | "lg";
}) {
  const title = displayTitle(anime.title);
  const img = anime.image || anime.cover;

  const widthClass =
    size === "sm" ? "w-[140px]" : size === "lg" ? "w-[200px]" : "w-[170px]";

  return (
    <Link
      href={`/anime/${anime.id}`}
      prefetch
      className={`group block ${widthClass} shrink-0`}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-panel border border-border group-hover:border-accent/60 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent/10">
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

        {/* Hover gradient + play button overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-accent/90 grid place-items-center backdrop-blur-sm shadow-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Rating badge */}
        {anime.rating ? (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span>{(anime.rating / 10).toFixed(1)}</span>
          </div>
        ) : null}

        {/* Type badge */}
        {anime.type ? (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
            {anime.type === "TV" ? "TV" : anime.type === "MOVIE" ? "MOVIE" : anime.type}
          </div>
        ) : null}
      </div>

      <div className="mt-2.5">
        <div className="text-sm font-medium line-clamp-2 leading-tight group-hover:text-accent transition-colors">
          {title}
        </div>
        <div className="mt-1 text-xs text-muted flex items-center gap-1.5">
          {anime.totalEpisodes ? (
            <>
              <span>{anime.totalEpisodes} ep</span>
              {anime.releaseDate ? <span className="text-dim">•</span> : null}
            </>
          ) : null}
          {anime.releaseDate ? <span>{anime.releaseDate}</span> : null}
        </div>
      </div>
    </Link>
  );
}
