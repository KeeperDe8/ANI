"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AnimeSummary } from "@/lib/types";
import { displayTitle } from "@/lib/types";

const FALLBACK_GRADIENTS = [
  "radial-gradient(ellipse at 70% 35%, #8b5cf6 0%, #4c1d95 35%, #1e1b4b 70%, #0b0b10 100%)",
  "radial-gradient(ellipse at 65% 40%, #be123c 0%, #7f1d1d 40%, #1e1b4b 75%, #0b0b10 100%)",
  "radial-gradient(ellipse at 60% 50%, #0369a1 0%, #1e3a8a 40%, #1e1b4b 75%, #0b0b10 100%)",
  "radial-gradient(ellipse at 75% 35%, #065f46 0%, #064e3b 40%, #1e1b4b 75%, #0b0b10 100%)",
];

const RANK_LABELS = ["Top this week", "Editor's pick", "Trending now", "New release"];

export default function HeroCarousel({
  slides,
  active,
  onActiveChange,
}: {
  slides: AnimeSummary[];
  active: number;
  onActiveChange: (i: number) => void;
}) {
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      onActiveChange((active + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, slides.length, timerKey]);

  function go(i: number) {
    onActiveChange((i + slides.length) % slides.length);
    setTimerKey((k) => k + 1);
  }

  if (!slides.length) return null;
  const cur = slides[active];
  const title = displayTitle(cur.title);

  return (
    <div className="relative w-full h-screen min-h-[620px] overflow-hidden bg-bg">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ani-kb { from { transform: scale(1.02); } to { transform: scale(1.1); } }
            .ani-slide-art { animation: ani-kb 10s ease-out forwards; }
          `,
        }}
      />

      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((s, i) => {
          const on = i === active;
          const bg = s.cover || s.image;
          return (
            <div
              key={s.id}
              className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
              style={{ opacity: on ? 1 : 0 }}
            >
              <div
                key={`${s.id}-${on ? "on" : "off"}`}
                className="ani-slide-art absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: bg ? `url(${bg})` : undefined,
                  background: bg ? undefined : FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, rgba(11,11,16,0.95) 0%, rgba(11,11,16,0.75) 40%, rgba(11,11,16,0.1) 80%, transparent 100%), linear-gradient(to top, #0b0b10 0%, rgba(11,11,16,0.2) 35%, transparent 60%)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Right-edge vertical dots */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-[7] flex flex-col gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className="border-0 p-0 cursor-pointer rounded transition-all"
            style={{
              width: 3,
              height: i === active ? 36 : 22,
              background: i === active ? "#fff" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* Hero content */}
      <div
        className="absolute left-0 right-0 top-[68px] bottom-[120px] z-[5] max-w-[1280px] mx-auto px-10 flex flex-col justify-center pointer-events-none"
      >
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2.5 text-[12px] font-semibold text-white/90 tracking-[0.14em] uppercase mb-4">
            <span
              className="inline-block"
              style={{ width: 28, height: 1, background: "linear-gradient(90deg,#8b5cf6,#ec4899)" }}
            />
            <span className="font-mono font-bold text-pink">
              N°{String(active + 1).padStart(2, "0")}
            </span>
            <span>{RANK_LABELS[active % RANK_LABELS.length]}</span>
          </div>

          <h1
            className="font-extrabold tracking-[-0.035em] leading-[0.98] m-0 mb-4 text-white max-w-[700px]"
            style={{ fontSize: "clamp(44px, 6vw, 68px)" }}
          >
            {title}
          </h1>

          <div className="flex items-center gap-3.5 text-[13px] text-[#c9c9d4] mb-[18px] flex-wrap">
            {cur.rating ? (
              <>
                <span className="text-amber-400 font-semibold">★ {(cur.rating / 10).toFixed(1)}</span>
                <span className="text-[#55556a]">·</span>
              </>
            ) : null}
            {cur.releaseDate ? (
              <>
                <span>{cur.releaseDate}</span>
                <span className="text-[#55556a]">·</span>
              </>
            ) : null}
            {cur.type && <span>{cur.type}</span>}
          </div>

          {cur.description && (
            <p
              className="text-[15px] text-[#c9c9d4] max-w-[540px] leading-[1.65] m-0 mb-7 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: cur.description }}
            />
          )}

          <div className="flex gap-2.5">
            <Link
              href={`/watch/${cur.id}/1`}
              prefetch
              className="px-[22px] py-[11px] text-sm font-semibold rounded-lg bg-white text-bg inline-flex items-center gap-2 hover:bg-white/90 transition"
            >
              ▶ Watch Now
            </Link>
            <Link
              href={`/anime/${cur.id}`}
              prefetch
              className="px-[22px] py-[11px] text-sm font-semibold rounded-lg text-white inline-flex items-center gap-2 transition"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(10px)",
              }}
            >
              + Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
