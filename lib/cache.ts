import { unstable_cache } from "next/cache";
import { jikanTop, jikanSearch, jikanInfo } from "./jikan";
import type { AnimeInfo, SearchResponse } from "./types";

export const getTrending = unstable_cache(
  async (): Promise<SearchResponse> => jikanTop("airing", 24),
  ["trending"],
  { revalidate: 300, tags: ["trending"] }
);

export const getPopular = unstable_cache(
  async (): Promise<SearchResponse> => jikanTop("bypopularity", 24),
  ["popular"],
  { revalidate: 600, tags: ["popular"] }
);

export const getSearch = unstable_cache(
  async (q: string): Promise<SearchResponse> => jikanSearch(q),
  ["search"],
  { revalidate: 300, tags: ["search"] }
);

export const getInfo = unstable_cache(
  async (id: string): Promise<AnimeInfo> => jikanInfo(id),
  ["info", "id"],
  { revalidate: 600, tags: ["info"] }
);
