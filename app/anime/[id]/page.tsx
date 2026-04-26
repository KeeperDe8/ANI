import { getInfo } from "@/lib/cache";
import { displayTitle } from "@/lib/types";
import EpisodeList from "@/components/EpisodeList";
import CastRow from "@/components/CastRow";
import AnimeRow from "@/components/AnimeRow";
import DetailHeroActions from "@/components/DetailHeroActions";
import DetailTabs from "@/components/DetailTabs";
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
  const description = info.description?.replace(/<[^>]*>/g, "") || "";

  return (
    <div>
      {/* Cinematic hero */}
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-10 pb-12 md:pt-16 md:pb-20 flex gap-8 flex-col md:flex-row md:items-end">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={title}
              className="w-[180px] md:w-[220px] rounded-xl border border-border shadow-2xl shrink-0 self-start"
            />
          ) : null}
          <div className="flex-1 min-w-0">
            {info.type ? (
              <div className="inline-block px-2.5 py-1 mb-3 rounded-md bg-accent/15 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider">
                {info.type === "TV" ? "Series" : info.type}
              </div>
            ) : null}

            <h1 className="hero-text text-3xl md:text-5xl font-bold tracking-tight mb-3 leading-[1.05]">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80 mb-5">
              {info.totalEpisodes ? <span>{info.totalEpisodes} Episodes</span> : null}
              {info.releaseDate ? (
                <>
                  <span className="text-white/30">•</span>
                  <span>{info.releaseDate}</span>
                </>
              ) : null}
              {info.status ? (
                <>
                  <span className="text-white/30">•</span>
                  <span>{info.status}</span>
                </>
              ) : null}
              {info.rating ? (
                <>
                  <span className="text-white/30">•</span>
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    {(info.rating / 10).toFixed(1)}
                  </span>
                </>
              ) : null}
            </div>

            {info.genres && info.genres.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {info.genres.slice(0, 6).map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2.5 py-1 border border-border bg-panel/60 backdrop-blur-sm rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            ) : null}

            <DetailHeroActions
              animeId={id}
              episodes={episodes.map((e) => ({ number: e.number, title: e.title, image: e.image }))}
              animeTitle={title}
              animeImage={info.image}
              animeCover={info.cover}
              totalEpisodes={info.totalEpisodes}
            />
          </div>
        </div>
      </div>

      {/* Story line */}
      {description ? (
        <section className="max-w-7xl mx-auto px-4 lg:px-6 mb-10">
          <h2 className="text-lg font-bold tracking-tight mb-3">Story Line</h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-4xl">
            {description}
          </p>
        </section>
      ) : null}

      {/* Cast */}
      {info.characters && info.characters.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 lg:px-6">
          <CastRow characters={info.characters} />
        </section>
      ) : null}

      {/* Tabs: Episodes / Info / Related */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 mb-12">
        <DetailTabs
          episodesCount={episodes.length}
          hasRelated={!!(info.recommendations?.length || info.relations?.length)}
          episodes={
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {episodes.length > 0 ? `1-${episodes.length} Episodes` : "Episodes"}
                </h3>
              </div>
              <EpisodeList
                animeId={id}
                episodes={episodes}
                fallbackImage={info.image}
                variant="grid"
              />
            </div>
          }
          info={
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 max-w-4xl text-sm">
              <InfoItem label="Type" value={info.type} />
              <InfoItem label="Status" value={info.status} />
              <InfoItem label="Episodes" value={info.totalEpisodes?.toString()} />
              <InfoItem label="Duration" value={info.duration ? `${info.duration} min` : undefined} />
              <InfoItem label="Aired" value={info.releaseDate?.toString()} />
              <InfoItem label="Season" value={info.season} />
              <InfoItem label="Studios" value={info.studios?.join(", ")} />
              <InfoItem label="Genres" value={info.genres?.join(", ")} />
            </div>
          }
          related={
            <div className="space-y-10">
              {info.recommendations && info.recommendations.length > 0 ? (
                <AnimeRow title="You might also like" items={info.recommendations} />
              ) : null}
              {info.relations && info.relations.length > 0 ? (
                <AnimeRow title="Related" items={info.relations} />
              ) : null}
            </div>
          }
        />
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 border-b border-border/60 py-2">
      <div className="w-28 text-muted shrink-0">{label}</div>
      <div className="flex-1">{value}</div>
    </div>
  );
}
