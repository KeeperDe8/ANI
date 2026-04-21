import { getTrending, getPopular } from "@/lib/cache";
import HomeRows from "@/components/HomeRows";
import type { SearchResponse } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  let trending: SearchResponse = { results: [] };
  let popular: SearchResponse = { results: [] };
  let error: string | null = null;

  try {
    [trending, popular] = await Promise.all([getTrending(), getPopular()]);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="py-6">
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-6 p-3 rounded border border-red-900 bg-red-950/40 text-red-200 text-sm">
          <strong>Provider unreachable.</strong>
          <div className="mt-1 text-xs opacity-70">{error}</div>
        </div>
      )}
      <HomeRows initialTrending={trending} initialPopular={popular} />
    </div>
  );
}
