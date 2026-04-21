import Link from "next/link";
import type { Episode } from "@/lib/types";

export default function EpisodeList({
  animeId,
  episodes,
  currentEpisode,
}: {
  animeId: string;
  episodes: Episode[];
  currentEpisode?: number;
}) {
  if (!episodes?.length) {
    return <p className="text-muted text-sm">No episodes available.</p>;
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2">
      {episodes.map((ep) => {
        const active = currentEpisode === ep.number;
        return (
          <li key={ep.id}>
            <Link
              href={`/watch/${animeId}/${ep.number}`}
              prefetch={active || ep.number < 6}
              className={[
                "block text-center py-2 rounded border text-sm transition-colors",
                active
                  ? "bg-accent border-accent text-white"
                  : "bg-panel border-border hover:border-accent hover:text-accent",
              ].join(" ")}
              title={ep.title || `Episode ${ep.number}`}
            >
              {ep.number}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
