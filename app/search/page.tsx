import { getSearch } from "@/lib/cache";
import AnimeCard from "@/components/AnimeCard";
import type { SearchResponse } from "@/lib/types";

export const revalidate = 300;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  let data: SearchResponse = { results: [] };
  let error: string | null = null;

  if (query) {
    try {
      data = await getSearch(query);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">
        {query ? (
          <>
            Results for <span className="text-accent">{query}</span>
          </>
        ) : (
          "Search"
        )}
      </h1>

      {!query && <p className="text-muted">Type something in the search bar above.</p>}

      {error && (
        <div className="p-3 rounded border border-red-900 bg-red-950/40 text-red-200 text-sm">
          {error}
        </div>
      )}

      {query && !error && data.results.length === 0 && (
        <p className="text-muted">No results.</p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        {data.results.map((a) => (
          <AnimeCard key={a.id} anime={a} />
        ))}
      </div>
    </div>
  );
}
