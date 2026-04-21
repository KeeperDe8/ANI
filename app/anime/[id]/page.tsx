import { getInfo } from "@/lib/cache";
import { displayTitle } from "@/lib/types";
import EpisodeList from "@/components/EpisodeList";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let info;
  try {
    info = await getInfo(id);
  } catch {
    notFound();
  }

  if (!info) notFound();

  const title = displayTitle(info.title);
  const cover = info.cover || info.image;
  const poster = info.image || info.cover;
  const episodes = info.episodes || [];
  const firstEp = episodes[0];

  return (
    <div>
      {/* Hero */}
      <div className="relative">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/70 to-bg" />
        <div className="relative max-w-7xl mx-auto px-4 py-10 flex gap-6 flex-col md:flex-row">
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={title}
              className="w-[180px] rounded-md border border-border shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <div className="flex flex-wrap gap-2 text-xs text-muted mb-4">
              {info.status && <span className="px-2 py-0.5 bg-panel rounded">{info.status}</span>}
              {info.type && <span className="px-2 py-0.5 bg-panel rounded">{info.type}</span>}
              {info.releaseDate && (
                <span className="px-2 py-0.5 bg-panel rounded">{info.releaseDate}</span>
              )}
              {info.totalEpisodes ? (
                <span className="px-2 py-0.5 bg-panel rounded">{info.totalEpisodes} ep</span>
              ) : null}
              {info.rating ? (
                <span className="px-2 py-0.5 bg-panel rounded">★ {info.rating}</span>
              ) : null}
            </div>
            {info.genres && info.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {info.genres.map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2 py-0.5 border border-border rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
            {info.description && (
              <p
                className="text-sm text-muted max-w-3xl leading-relaxed line-clamp-6"
                dangerouslySetInnerHTML={{ __html: info.description }}
              />
            )}
            {firstEp && (
              <Link
                href={`/watch/${id}/${firstEp.number}`}
                className="inline-block mt-5 bg-accent hover:bg-accentHover text-white font-medium px-5 py-2 rounded transition-colors"
              >
                ▶ Watch Episode 1
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Episodes</h2>
        <EpisodeList animeId={id} episodes={episodes} />
      </div>
    </div>
  );
}
