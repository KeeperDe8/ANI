"use client";

import { useState } from "react";
import HeroCarousel from "./HeroCarousel";
import Top10Ticker from "./Top10Ticker";
import type { AnimeSummary } from "@/lib/types";

export default function HomeHero({
  slides,
  ticker,
}: {
  slides: AnimeSummary[];
  ticker: AnimeSummary[];
}) {
  const [active, setActive] = useState(0);
  const dotCount = Math.min(slides.length || 4, 4);
  return (
    <div className="relative">
      <HeroCarousel slides={slides} active={active % (slides.length || 1)} onActiveChange={setActive} />
      <Top10Ticker items={ticker} activeDot={active % dotCount} dotCount={dotCount} />
    </div>
  );
}
