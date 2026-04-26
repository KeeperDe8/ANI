import { ANIME } from "@consumet/extensions";
import { REAL_PROVIDERS, type ProviderKey } from "./providers";
import type { WatchResponse } from "./types";
import { kasSearchAndWatch } from "./kickassanime";

export { PROVIDERS, REAL_PROVIDERS, type ProviderKey } from "./providers";

type RealProvider = Exclude<ProviderKey, "auto">;

export { kasSearchAndWatch };
type RawProvider = InstanceType<typeof ANIME.AnimeKai>;

const rawClients = new Map<RealProvider, RawProvider>();

function makeProvider(key: RealProvider): RawProvider {
  switch (key) {
    case "animeunity": {
      const p = new ANIME.AnimeUnity();
      return p as unknown as RawProvider;
    }
    case "animekai":
    default: {
      const p = new ANIME.AnimeKai();
      (p as unknown as { baseUrl: string }).baseUrl = "https://anikai.to";
      return p;
    }
  }
}

function rawClient(provider: RealProvider): RawProvider {
  let c = rawClients.get(provider);
  if (!c) {
    c = makeProvider(provider);
    rawClients.set(provider, c);
  }
  return c;
}

function titleSim(a: string, b: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const na = norm(a);
  const nb = norm(b);
  if (na === nb) return 1;
  if (na.startsWith(nb) || nb.startsWith(na)) return 0.9;
  const wa = new Set(na.split(" ").filter(Boolean));
  const wb = nb.split(" ").filter(Boolean);
  if (!wa.size || !wb.length) return 0;
  const overlap = wb.filter((w) => wa.has(w)).length;
  return overlap / Math.max(wa.size, wb.length);
}

export async function searchAndWatch(
  title: string,
  episodeNumber: number,
  provider: RealProvider
): Promise<WatchResponse & { provider: string }> {
  if (provider === "kickassanime") {
    return kasSearchAndWatch(title, episodeNumber);
  }

  const client = rawClient(provider);

  const searchRes = await (client as unknown as { search: (q: string) => Promise<{ results: Array<{ id: string; title?: string }> }> })
    .search(title);
  const results = searchRes?.results ?? [];
  if (!results.length) throw new Error(`"${title}" not found on ${provider}`);

  const best = results.reduce((acc, cur) => {
    return titleSim(cur.title ?? cur.id, title) >= titleSim(acc.title ?? acc.id, title)
      ? cur
      : acc;
  });

  const info = await (client as unknown as { fetchAnimeInfo: (id: string) => Promise<{ episodes?: Array<{ id: string; number: number }> }> })
    .fetchAnimeInfo(best.id);
  const episodes = info.episodes ?? [];
  const ep = episodes.find((e) => e.number === episodeNumber);
  if (!ep) throw new Error(`episode ${episodeNumber} not on ${provider}`);

  const watch = await (client as unknown as { fetchEpisodeSources: (id: string) => Promise<WatchResponse> })
    .fetchEpisodeSources(ep.id);
  if (!watch?.sources?.length) throw new Error(`no sources from ${provider}`);

  return { provider, ...watch };
}
