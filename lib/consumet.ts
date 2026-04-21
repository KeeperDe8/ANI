import { META, ANIME } from "@consumet/extensions";
import type { AnimeInfo, SearchResponse, WatchResponse } from "./types";
import { PROVIDERS, REAL_PROVIDERS, type ProviderKey } from "./providers";

export { PROVIDERS, REAL_PROVIDERS, type ProviderKey };

type RealProvider = Exclude<ProviderKey, "auto">;

const clients = new Map<RealProvider, InstanceType<typeof META.Anilist>>();

function makeProvider(key: RealProvider) {
  switch (key) {
    case "animepahe": {
      const p = new ANIME.AnimePahe();
      // default `animepahe.si` is dead — patch to current live domain
      (p as unknown as { baseUrl: string }).baseUrl = "https://animepahe.ru";
      return p;
    }
    case "kickassanime": {
      const p = new ANIME.KickAssAnime();
      // default `kickass-anime.ru` 301-redirects — patch to `.ro`
      (p as unknown as { baseUrl: string }).baseUrl = "https://kickass-anime.ro";
      return p;
    }
    case "animekai":
    default:
      return new ANIME.AnimeKai();
  }
}

function client(provider: RealProvider = "animekai") {
  let c = clients.get(provider);
  if (!c) {
    c = new META.Anilist(makeProvider(provider));
    clients.set(provider, c);
  }
  return c;
}

export const consumet = {
  trending: async (page = 1, perPage = 24): Promise<SearchResponse> => {
    return (await client().fetchTrendingAnime(page, perPage)) as unknown as SearchResponse;
  },

  popular: async (page = 1, perPage = 24): Promise<SearchResponse> => {
    return (await client().fetchPopularAnime(page, perPage)) as unknown as SearchResponse;
  },

  search: async (query: string, page = 1, perPage = 24): Promise<SearchResponse> => {
    return (await client().search(query, page, perPage)) as unknown as SearchResponse;
  },

  info: async (id: string, provider: RealProvider = "animekai"): Promise<AnimeInfo> => {
    return (await client(provider).fetchAnimeInfo(id)) as unknown as AnimeInfo;
  },

  watch: async (episodeId: string, provider: RealProvider = "animekai"): Promise<WatchResponse> => {
    return (await client(provider).fetchEpisodeSources(episodeId)) as unknown as WatchResponse;
  },
};
