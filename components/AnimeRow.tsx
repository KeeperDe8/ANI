import type { AnimeSummary } from "@/lib/types";
import AnimeCard from "./AnimeCard";

export default function AnimeRow({
  title,
  items,
}: {
  title: string;
  items: AnimeSummary[];
}) {
  if (!items?.length) return null;
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-3 px-4 max-w-7xl mx-auto">{title}</h2>
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 pb-2">
          {items.map((a) => (
            <AnimeCard key={a.id} anime={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
