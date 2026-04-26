import { getInfo } from "@/lib/cache";
import { fetchAuto } from "@/lib/watch";
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
  let current = episodes.find((e) => e.number === episodeNumber);
  if (!current && info.totalEpisodes && episodeNumber >= 1 && episodeNumber <= info.totalEpisodes) {
    current = { id: String(episodeNumber), number: episodeNumber };
  }
  if (!current) notFound();

  const prev = episodes.find((e) => e.number === episodeNumber - 1)
    ?? (episodeNumber > 1 ? { id: String(episodeNumber - 1), number: episodeNumber - 1 } : undefined);
  const next = episodes.find((e) => e.number === episodeNumber + 1)
    ?? (info.totalEpisodes && episodeNumber < info.totalEpisodes ? { id: String(episodeNumber + 1), number: episodeNumber + 1 } : undefined);
  const animeTitle = displayTitle(info.title);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
      <div>
        {/* Breadcrumb / back */}
        <div className="mb-4 flex items-center gap-3 text-sm">
          <Link
            href={`/anime/${id}`}
            className="inline-flex items-center gap-1.5 text-muted hover:text-accent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </Link>
          <span className="text-dim">/</span>
          <Link href={`/anime/${id}`} className="text-muted hover:text-white truncate transition-colors">
            {animeTitle}
          </Link>
          <span className="text-dim">/</span>
          <span className="text-white shrink-0">Episode {episodeNumber}</span>
        </div>

        <Suspense
          fallback={
            <div className="aspect-video w-full bg-panel rounded-xl shimmer" />
          }
        >
          <PlayerShell
            animeId={id}
            episodeId={current.id}
            episodeNumber={episodeNumber}
            poster={current.image || info.image}
            animeTitle={animeTitle}
            animeImage={info.image}
            animeCover={info.cover}
            totalEpisodes={info.totalEpisodes}
            episodeTitle={current.title}
          />
        </Suspense>

        <div className="mt-5">
          <h1 className="text-2xl font-bold tracking-tight">
            {current.title || `Episode ${episodeNumber}`}
          </h1>
          <div className="mt-1 text-sm text-muted">
            <Link href={`/anime/${id}`} className="hover:text-accent">
              {animeTitle}
            </Link>
            {" · "}Episode {episodeNumber}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          {prev ? (
            <Link
              href={`/watch/${id}/${prev.number}`}
              prefetch
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-panel border border-border rounded-full hover:border-accent hover:text-accent transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Previous
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-panel border border-border rounded-full text-dim opacity-50 cursor-not-allowed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Previous
            </span>
          )}
          {next ? (
            <Link
              href={`/watch/${id}/${next.number}`}
              prefetch
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-panel border border-border rounded-full hover:border-accent hover:text-accent transition-colors"
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-panel border border-border rounded-full text-dim opacity-50 cursor-not-allowed">
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          )}
        </div>
      </div>

      <aside className="lg:max-h-[calc(100vh-6rem)] lg:sticky lg:top-20 lg:overflow-y-auto lg:pr-1">
        <h2 className="text-sm font-bold mb-3 text-muted uppercase tracking-wide">
          Episodes
          <span className="ml-2 text-dim normal-case font-medium">{episodes.length}</span>
        </h2>
        <EpisodeList
          animeId={id}
          episodes={episodes}
          currentEpisode={episodeNumber}
          fallbackImage={info.image}
          variant="compact"
        />
      </aside>
    </div>
  );
}

async function PlayerShell({
  animeId,
  episodeId,
  episodeNumber,
  poster,
  animeTitle,
  animeImage,
  animeCover,
  totalEpisodes,
  episodeTitle,
}: {
  animeId: string;
  episodeId: string;
  episodeNumber: number;
  poster?: string;
  animeTitle: string;
  animeImage?: string;
  animeCover?: string;
  totalEpisodes?: number;
  episodeTitle?: string;
}) {
  let watchData;
  let watchError: string | null = null;
  try {
    watchData = await fetchAuto(animeTitle, episodeNumber);
  } catch (e) {
    if (e instanceof AggregateError) {
      watchError = e.errors.map((x) => (x instanceof Error ? x.message : String(x))).join(" | ");
    } else {
      watchError = e instanceof Error ? e.message : String(e);
    }
  }

  if (watchError || !watchData?.sources?.length) {
    return (
      <div>
        <div className="aspect-video w-full rounded-xl border border-red-900/50 bg-red-950/20 grid place-items-center p-6 text-center">
          <div>
            <p className="text-red-200 font-medium mb-1">All servers failed to load stream.</p>
            <p className="text-xs text-red-200/70">
              {watchError || "Try selecting a server manually below."}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <VideoPlayer
            animeId={animeId}
            episodeNumber={episodeNumber}
            initialSources={[]}
            initialReferer={undefined}
            poster={poster}
            animeTitle={animeTitle}
            animeImage={animeImage}
            animeCover={animeCover}
            totalEpisodes={totalEpisodes}
            episodeTitle={episodeTitle}
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
      initialSubtitles={watchData.subtitles}
      initialProvider={watchData.provider as import("@/lib/providers").ProviderKey}
      poster={poster}
      animeTitle={animeTitle}
      animeImage={animeImage}
      animeCover={animeCover}
      totalEpisodes={totalEpisodes}
      episodeTitle={episodeTitle}
    />
  );
}
