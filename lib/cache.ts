import { unstable_cache } from "next/cache";
import { consumet } from "./consumet";
import type { ProviderKey } from "./providers";
import type { AnimeInfo, SearchResponse } from "./types";

type RealProvider = Exclude<ProviderKey, "auto">;

export const getTrending = unstable_cache(
  async (): Promise<SearchResponse> => consumet.trending(1, 24),
  ["trending"],
  { revalidate: 60, tags: ["trending"] }
);

export const getPopular = unstable_cache(
  async (): Promise<SearchResponse> => consumet.popular(1, 24),
  ["popular"],
  { revalidate: 300, tags: ["popular"] }
);

export const getInfo = unstable_cache(
  async (id: string, provider: RealProvider = "animekai"): Promise<AnimeInfo> =>
    consumet.info(id, provider),
  ["info"],
  { revalidate: 600, tags: ["info"] }
);

export const getSearch = unstable_cache(
  async (q: string): Promise<SearchResponse> => consumet.search(q, 1, 24),
  ["search"],
  { revalidate: 300, tags: ["search"] }
);
