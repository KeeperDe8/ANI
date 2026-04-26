import type { AnimeSummary, AnimeInfo, SearchResponse, Episode } from "./types";

const JIKAN_BASE = "https://api.jikan.moe/v4";

async function jFetch(path: string) {
  const res = await fetch(`${JIKAN_BASE}${path}`, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Jikan ${res.status}: ${path}`);
  return res.json();
}

function img(images: Record<string, any> | undefined): string | undefined {
  if (!images) return undefined;
  return (
    images.jpg?.large_image_url ||
    images.jpg?.image_url ||
    images.webp?.large_image_url ||
    undefined
  );
}

function parseDuration(dur: string | undefined): number | undefined {
  if (!dur) return undefined;
  const m = dur.match(/(\d+)\s*min/);
  return m ? parseInt(m[1]) : undefined;
}

function toSummary(a: Record<string, any>): AnimeSummary {
  return {
    id: String(a.mal_id),
    malId: a.mal_id,
    title: {
      english: a.title_english || a.title,
      romaji: a.title,
      native: a.title_japanese,
    },
    image: img(a.images),
    cover: a.images?.jpg?.large_image_url || img(a.images),
    description: a.synopsis,
    status: a.status,
    rating: a.score ? Math.round(a.score * 10) : undefined,
    releaseDate: a.year?.toString() ?? a.aired?.prop?.from?.year?.toString(),
    type: a.type,
    totalEpisodes: a.episodes ?? undefined,
  };
}

function toInfo(a: Record<string, any>, episodes: Episode[]): AnimeInfo {
  return {
    ...toSummary(a),
    genres: (a.genres ?? []).map((g: Record<string, any>) => g.name),
    studios: (a.studios ?? []).map((s: Record<string, any>) => s.name),
    season: a.season,
    duration: parseDuration(a.duration),
    episodes,
    trailer: a.trailer?.youtube_id
      ? {
          id: a.trailer.youtube_id,
          site: "YouTube",
          thumbnail: a.trailer.images?.medium_image_url,
        }
      : undefined,
  };
}

export async function jikanSearch(q: string, page = 1): Promise<SearchResponse> {
  const data = await jFetch(
    `/anime?q=${encodeURIComponent(q)}&page=${page}&limit=24&sfw=true`
  );
  return {
    currentPage: page,
    hasNextPage: data.pagination?.has_next_page ?? false,
    results: (data.data ?? []).map(toSummary),
  };
}

export async function jikanTop(filter = "airing", limit = 24): Promise<SearchResponse> {
  const data = await jFetch(`/top/anime?filter=${filter}&limit=${limit}`);
  return { results: (data.data ?? []).map(toSummary) };
}

async function fetchAllEpisodes(malId: string): Promise<Episode[]> {
  const episodes: Episode[] = [];
  let page = 1;
  while (true) {
    const res = await jFetch(`/anime/${malId}/episodes?page=${page}`);
    const chunk: Record<string, any>[] = res.data ?? [];
    episodes.push(
      ...chunk.map((e) => ({
        id: String(e.mal_id),
        number: e.mal_id as number,
        title: (e.title as string | undefined) || undefined,
      }))
    );
    if (!res.pagination?.has_next_page) break;
    page++;
  }
  return episodes;
}

export async function jikanInfo(malId: string): Promise<AnimeInfo> {
  const [animeRes, episodes] = await Promise.all([
    jFetch(`/anime/${malId}`),
    fetchAllEpisodes(malId),
  ]);

  let resolvedEpisodes = episodes;

  // If Jikan has no episode data yet, generate stubs from total count
  if (!resolvedEpisodes.length && animeRes.data?.episodes) {
    resolvedEpisodes = Array.from({ length: animeRes.data.episodes as number }, (_, i) => ({
      id: String(i + 1),
      number: i + 1,
    }));
  }

  return toInfo(animeRes.data, resolvedEpisodes);
}
