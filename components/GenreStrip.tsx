import Link from "next/link";

const GENRES = [
  { name: "Action", icon: "⚔️", color: "from-red-500/20 to-orange-500/20" },
  { name: "Adventure", icon: "🗺️", color: "from-emerald-500/20 to-teal-500/20" },
  { name: "Romance", icon: "💕", color: "from-pink-500/20 to-rose-500/20" },
  { name: "Comedy", icon: "😄", color: "from-yellow-500/20 to-amber-500/20" },
  { name: "Drama", icon: "🎭", color: "from-purple-500/20 to-fuchsia-500/20" },
  { name: "Fantasy", icon: "🐉", color: "from-violet-500/20 to-indigo-500/20" },
  { name: "Sci-Fi", icon: "🚀", color: "from-cyan-500/20 to-blue-500/20" },
  { name: "Horror", icon: "👻", color: "from-slate-500/20 to-zinc-500/20" },
  { name: "Mystery", icon: "🔍", color: "from-indigo-500/20 to-purple-500/20" },
  { name: "Slice of Life", icon: "🌸", color: "from-rose-500/20 to-pink-500/20" },
  { name: "Sports", icon: "⚽", color: "from-green-500/20 to-emerald-500/20" },
  { name: "Supernatural", icon: "✨", color: "from-purple-500/20 to-violet-500/20" },
];

export default function GenreStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 mb-12">
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-2">
          {GENRES.map((g) => (
            <Link
              key={g.name}
              href={`/search?q=${encodeURIComponent(g.name)}`}
              className={`group shrink-0 px-5 py-3 rounded-xl bg-gradient-to-br ${g.color} border border-border hover:border-accent/50 transition-all hover:scale-[1.03]`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl group-hover:scale-110 transition-transform">{g.icon}</span>
                <span className="text-sm font-semibold text-white whitespace-nowrap">{g.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
