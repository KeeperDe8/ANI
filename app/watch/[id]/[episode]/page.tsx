import { getInfo } from "@/lib/cache";
import { consumet } from "@/lib/consumet";
import { displayTitle } from "@/lib/types";
import EpisodeList from "@/components/EpisodeList";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 600;

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string; episode: string }>;
}) {
  const { id, episode: episodeParam } = await params;
  const episodeNumber = Number(episodeParam);
  if (!Number.isFinite(episodeNumber)) notFound();

  let info;
  try {
    info = await getInfo(id);
  } catch {
    notFound();
  }
  if (!info) notFound();

  const episodes = info.episodes || [];
  const current = episodes.find((e) => e.number === episodeNumber);
  if (!current) notFound();

  const prev = episodes.find((e) => e.number === episodeNumber - 1);
  const next = episodes.find((e) => e.number === episodeNumber + 1);
  const animeTitle = displayTitle(info.title);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <div className="mb-3 text-sm text-muted">
          <Link href={`/anime/${id}`} className="hover:text-accent">
            {animeTitle}
          </Link>
          <span className="mx-2">/</span>
          <span>Episode {episodeNumber}</span>
        </div>

        <Suspense
          fallback={
            <div className="aspect-video w-full bg-panel rounded-md animate-pulse" />
          }
        >
          <PlayerShell
            animeId={id}
            episodeId={current.id}
            episodeNumber={episodeNumber}
            poster={current.image || info.image}
          />
        </Suspense>

        <h1 className="mt-4 text-xl font-semibold">
          {current.title || `Episode ${episodeNumber}`}
        </h1>

        <div className="mt-3 flex gap-2">
          {prev ? (
            <Link
              href={`/watch/${id}/${prev.number}`}
              prefetch
              className="px-3 py-1.5 text-sm bg-panel border border-border rounded hover:border-accent"
            >
              ← Prev
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-sm bg-panel border border-border rounded text-muted opacity-50">
              ← Prev
            </span>
          )}
          {next ? (
            <Link
              href={`/watch/${id}/${next.number}`}
              prefetch
              className="px-3 py-1.5 text-sm bg-panel border border-border rounded hover:border-accent"
            >
              Next →
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-sm bg-panel border border-border rounded text-muted opacity-50">
              Next →
            </span>
          )}
        </div>
      </div>

      <aside className="lg:max-h-[calc(100vh-6rem)] lg:sticky lg:top-20 lg:overflow-y-auto">
        <h2 className="text-sm font-semibold mb-3 text-muted uppercase tracking-wide">
          Episodes
        </h2>
        <EpisodeList animeId={id} episodes={episodes} currentEpisode={episodeNumber} />
      </aside>
    </div>
  );
}

async function PlayerShell({
  animeId,
  episodeId,
  episodeNumber,
  poster,
}: {
  animeId: string;
  episodeId: string;
  episodeNumber: number;
  poster?: string;
}) {
  let watchData;
  let watchError: string | null = null;
  try {
    watchData = await consumet.watch(episodeId);
  } catch (e) {
    watchError = e instanceof Error ? e.message : String(e);
  }

  if (watchError || !watchData?.sources?.length) {
    return (
      <div className="aspect-video w-full rounded-md border border-red-900 bg-red-950/30 grid place-items-center p-6 text-center">
        <div>
          <p className="text-red-200 font-medium mb-1">Couldn't load stream.</p>
          <p className="text-xs text-red-200/70">
            {watchError || "No sources returned. Try another server below."}
          </p>
          <VideoPlayer
            animeId={animeId}
            episodeNumber={episodeNumber}
            initialSources={[]}
            initialReferer={undefined}
            poster={poster}
            serverOnly
          />
        </div>
      </div>
    );
  }

  return (
    <VideoPlayer
      animeId={animeId}
      episodeNumber={episodeNumber}
      initialSources={watchData.sources}
      initialReferer={watchData.headers?.Referer}
      poster={poster}
    />
  );
}
