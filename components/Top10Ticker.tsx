"use client";

import Link from "next/link";
import type { AnimeSummary } from "@/lib/types";
import { displayTitle } from "@/lib/types";

export default function Top10Ticker({
  items,
  activeDot = 0,
  dotCount = 4,
}: {
  items: AnimeSummary[];
  activeDot?: number;
  dotCount?: number;
}) {
  if (!items?.length) return null;
  const doubled = [...items, ...items];
  return (
    <div className="absolute left-0 right-0 bottom-0 z-[6] pt-[18px] pb-[22px]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ani-roll { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 5px)); } }
            .ani-rail-inner { animation: ani-roll 50s linear infinite; width: max-content; }
            .ani-rail:hover .ani-rail-inner { animation-play-state: paused; }
            .ani-rail { mask: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent); -webkit-mask: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent); }
          `,
        }}
      />
      <div className="max-w-[1280px] mx-auto mb-3 px-10 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted m-0">
          Top 10 This Week
        </h3>
        <div className="flex gap-[5px]">
          {Array.from({ length: dotCount }).map((_, i) => (
            <span
              key={i}
              className="block rounded-[1px] transition-colors"
              style={{
                width: 18,
                height: 2,
                background: i === activeDot ? "#fff" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </div>
      <div className="ani-rail max-w-[1280px] mx-auto px-10 overflow-hidden relative">
        <div className="ani-rail-inner flex gap-2.5">
          {doubled.map((a, i) => {
            const rank = (i % items.length) + 1;
            const top = rank <= 3;
            const title = displayTitle(a.title);
            const bg = a.image || a.cover;
            return (
              <Link
                key={`${a.id}-${i}`}
                href={`/anime/${a.id}`}
                className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/5 shrink-0"
                style={{ width: 200 }}
              >
                <div
                  className="font-mono font-bold text-center shrink-0"
                  style={{
                    width: 22,
                    fontSize: 18,
                    letterSpacing: "-0.04em",
                    color: top ? "#ec4899" : "#55556a",
                  }}
                >
                  {String(rank).padStart(2, "0")}
                </div>
                <div
                  className="shrink-0 rounded bg-cover bg-center"
                  style={{
                    width: 28,
                    height: 40,
                    background: bg
                      ? `center/cover url(${bg})`
                      : "linear-gradient(135deg,#7c3aed,#0b0b10)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-white font-medium truncate">{title}</div>
                  <div className="text-[10.5px] text-muted mt-px truncate">
                    {a.type || "TV"} {a.totalEpisodes ? `· ${a.totalEpisodes} ep` : ""}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
