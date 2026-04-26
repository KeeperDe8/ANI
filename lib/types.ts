export type Title = {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
};

export type AnimeSummary = {
  id: string;
  malId?: number;
  title: Title | string;
  image?: string;
  cover?: string;
  description?: string;
  status?: string;
  rating?: number;
  releaseDate?: number | string;
  type?: string;
  color?: string;
  totalEpisodes?: number;
};

export type Episode = {
  id: string;
  number: number;
  title?: string;
  image?: string;
  description?: string;
  url?: string;
};

export type VoiceActor = {
  id?: number;
  language?: string;
  name?: { first?: string; last?: string; full?: string; native?: string };
  image?: string;
};

export type Character = {
  id?: number;
  role?: string;
  name?: { first?: string; last?: string; full?: string; native?: string };
  image?: string;
  voiceActors?: VoiceActor[];
};

export type AnimeInfo = AnimeSummary & {
  genres?: string[];
  studios?: string[];
  season?: string;
  duration?: number;
  episodes?: Episode[];
  synonyms?: string[];
  isAdult?: boolean;
  characters?: Character[];
  recommendations?: AnimeSummary[];
  relations?: AnimeSummary[];
  trailer?: { id?: string; site?: string; thumbnail?: string };
  nextAiringEpisode?: { episode: number; airingTime: number; timeUntilAiring: number };
};

export type StreamSource = {
  url: string;
  quality?: string;
  isM3U8?: boolean;
};

export type StreamSubtitle = {
  url: string;
  lang: string;
};

export type WatchResponse = {
  headers?: Record<string, string>;
  sources: StreamSource[];
  subtitles?: StreamSubtitle[];
  download?: string;
};

export type SearchResponse = {
  currentPage?: number;
  hasNextPage?: boolean;
  results: AnimeSummary[];
};

export function displayTitle(t: Title | string | undefined): string {
  if (!t) return "Untitled";
  if (typeof t === "string") return t;
  return t.english || t.romaji || t.userPreferred || t.native || "Untitled";
}

export function characterName(c: Character): string {
  if (!c.name) return "Unknown";
  return c.name.full || [c.name.first, c.name.last].filter(Boolean).join(" ") || c.name.native || "Unknown";
}
