"use client";

import useSWR from "swr";
import AnimeRow from "./AnimeRow";
import type { SearchResponse } from "@/lib/types";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function HomeRows({
  initialTrending,
  initialPopular,
}: {
  initialTrending: SearchResponse;
  initialPopular: SearchResponse;
}) {
  const { data } = useSWR<{ trending: SearchResponse; popular: SearchResponse }>(
    "/api/trending",
    fetcher,
    {
      fallbackData: { trending: initialTrending, popular: initialPopular },
      refreshInterval: 60_000,
      revalidateOnFocus: true,
    }
  );

  const trending = data?.trending || initialTrending;
  const popular = data?.popular || initialPopular;

  return (
    <>
      <AnimeRow title="Trending" items={trending.results} />
      <AnimeRow title="Popular" items={popular.results} />
    </>
  );
}
