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
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        {query ? (
          <>
            <div className="text-sm text-muted mb-2">Search results</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="text-accent">"{query}"</span>
            </h1>
            {!error && data.results.length > 0 ? (
              <p className="text-sm text-muted mt-2">
                Found {data.results.length} {data.results.length === 1 ? "result" : "results"}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Search</h1>
            <p className="text-muted mt-2">Type something in the search bar above to discover anime.</p>
          </>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg border border-red-900/50 bg-red-950/30 text-red-200 text-sm mb-6">
          {error}
        </div>
      )}

      {query && !error && data.results.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-block w-16 h-16 rounded-full bg-panel grid place-items-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <p className="text-lg font-semibold">No results found</p>
          <p className="text-sm text-muted mt-1">Try a different search term.</p>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 md:gap-5">
        {data.results.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i).map((a) => (
          <AnimeCard key={a.id} anime={a} />
        ))}
      </div>
    </div>
  );
}
