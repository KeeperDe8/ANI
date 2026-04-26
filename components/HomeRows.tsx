"use client";

import useSWR from "swr";
import HeroBanner from "./HeroBanner";
import GenreStrip from "./GenreStrip";
import ContinueWatching from "./ContinueWatching";
import NumberedRow from "./NumberedRow";
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

  // Heuristic: split trending for hero + a fresh "Just Released" row
  const heroItems = trending.results.slice(0, 5);
  const justReleased = trending.results.slice(5, 17);

  return (
    <>
      <HeroBanner items={heroItems} />

      <div className="pt-8">
        <GenreStrip />
      </div>

      <ContinueWatching />

      <NumberedRow
        title="Popular of the Week"
        subtitle="What everyone's watching right now"
        items={popular.results}
      />

      <AnimeRow
        title="Just Released"
        subtitle="Fresh from this season"
        items={justReleased}
      />

      <AnimeRow
        title="Trending Now"
        subtitle="Most watched today"
        items={trending.results}
      />

      <AnimeRow
        title="Popular All-Time"
        subtitle="Beloved classics and modern hits"
        items={popular.results}
      />
    </>
  );
}
