// Tracks playback progress for the "Continue Watching" feature.
// Storage is browser-local (localStorage). All operations are SSR-safe.

import type { AnimeSummary } from "./types";

export type ProgressEntry = {
  animeId: string;
  episodeNumber: number;
  currentTime: number;
  duration: number;
  updatedAt: number;
  // Snapshot of anime metadata so the row can render without an extra fetch
  title?: string;
  image?: string;
  cover?: string;
  totalEpisodes?: number;
  episodeTitle?: string;
  episodeImage?: string;
};

const KEY = "ani:progress";
const MAX_ENTRIES = 24;

function safeParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export function listProgress(): ProgressEntry[] {
  if (typeof window === "undefined") return [];
  const all = safeParse<Record<string, ProgressEntry>>(
    window.localStorage.getItem(KEY),
    {}
  );
  return Object.values(all)
    .filter((e) => e && e.duration > 0 && e.currentTime / e.duration < 0.95)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getProgress(animeId: string, episodeNumber?: number): ProgressEntry | undefined {
  if (typeof window === "undefined") return undefined;
  const all = safeParse<Record<string, ProgressEntry>>(
    window.localStorage.getItem(KEY),
    {}
  );
  if (episodeNumber != null) {
    return all[`${animeId}:${episodeNumber}`];
  }
  // Latest progress for this anime, regardless of episode
  const candidates = Object.values(all).filter((e) => e.animeId === animeId);
  candidates.sort((a, b) => b.updatedAt - a.updatedAt);
  return candidates[0];
}

export function saveProgress(entry: ProgressEntry): void {
  if (typeof window === "undefined") return;
  const all = safeParse<Record<string, ProgressEntry>>(
    window.localStorage.getItem(KEY),
    {}
  );
  all[`${entry.animeId}:${entry.episodeNumber}`] = entry;

  // Trim to MAX_ENTRIES, dropping oldest
  const entries = Object.entries(all);
  if (entries.length > MAX_ENTRIES) {
    entries.sort(([, a], [, b]) => b.updatedAt - a.updatedAt);
    const trimmed = Object.fromEntries(entries.slice(0, MAX_ENTRIES));
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } else {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  }
}

export function clearProgress(animeId: string, episodeNumber?: number): void {
  if (typeof window === "undefined") return;
  const all = safeParse<Record<string, ProgressEntry>>(
    window.localStorage.getItem(KEY),
    {}
  );
  if (episodeNumber != null) {
    delete all[`${animeId}:${episodeNumber}`];
  } else {
    for (const k of Object.keys(all)) {
      if (all[k].animeId === animeId) delete all[k];
    }
  }
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function progressPercent(e: Pick<ProgressEntry, "currentTime" | "duration">): number {
  if (!e.duration) return 0;
  return Math.min(100, Math.max(0, (e.currentTime / e.duration) * 100));
}

// Convenience: build a snapshot entry from an AnimeSummary + episode info
export function snapshotFromAnime(
  anime: Pick<AnimeSummary, "id" | "title" | "image" | "cover" | "totalEpisodes">,
  episodeNumber: number,
  currentTime: number,
  duration: number,
  episodeTitle?: string,
  episodeImage?: string
): ProgressEntry {
  const titleStr =
    typeof anime.title === "string"
      ? anime.title
      : anime.title?.english || anime.title?.romaji || anime.title?.userPreferred || "Untitled";
  return {
    animeId: anime.id,
    episodeNumber,
    currentTime,
    duration,
    updatedAt: Date.now(),
    title: titleStr,
    image: anime.image,
    cover: anime.cover,
    totalEpisodes: anime.totalEpisodes,
    episodeTitle,
    episodeImage,
  };
}
