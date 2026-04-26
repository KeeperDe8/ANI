import { searchAndWatch } from "@/lib/consumet";
import { REAL_PROVIDERS, type ProviderKey } from "@/lib/providers";
import { cached } from "@/lib/memcache";
import type { WatchResponse } from "@/lib/types";

const TTL = 5 * 60 * 1000;

export type WatchResult = WatchResponse & { provider: string; episodeId?: string };

export async function fetchForProvider(
  animeTitle: string,
  episodeNumber: number,
  provider: Exclude<ProviderKey, "auto">
): Promise<WatchResult> {
  const key = `watch|${animeTitle}|${episodeNumber}|${provider}`;
  return cached(key, TTL, () => searchAndWatch(animeTitle, episodeNumber, provider));
}

export async function fetchAuto(
  animeTitle: string,
  episodeNumber: number
): Promise<WatchResult> {
  return Promise.any(
    REAL_PROVIDERS.map((p) => fetchForProvider(animeTitle, episodeNumber, p))
  );
}
