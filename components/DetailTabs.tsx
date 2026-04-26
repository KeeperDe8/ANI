"use client";

import { useState } from "react";

type TabKey = "episodes" | "info" | "related";

export default function DetailTabs({
  episodesCount,
  hasRelated,
  episodes,
  info,
  related,
}: {
  episodesCount: number;
  hasRelated: boolean;
  episodes: React.ReactNode;
  info: React.ReactNode;
  related: React.ReactNode;
}) {
  const [tab, setTab] = useState<TabKey>("episodes");

  const tabs: { key: TabKey; label: string; count?: number; show: boolean }[] = [
    { key: "episodes", label: "Episodes", count: episodesCount, show: true },
    { key: "info", label: "Info", show: true },
    { key: "related", label: "Related", show: hasRelated },
  ];

  return (
    <div>
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto no-scrollbar">
        {tabs
          .filter((t) => t.show)
          .map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                tab === t.key ? "text-accent" : "text-muted hover:text-white"
              }`}
            >
              {t.label}
              {t.count != null ? (
                <span className={`ml-1.5 text-xs ${tab === t.key ? "text-accent/70" : "text-dim"}`}>
                  {t.count}
                </span>
              ) : null}
              {tab === t.key ? (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t" />
              ) : null}
            </button>
          ))}
      </div>

      <div className="animate-fade-in">
        {tab === "episodes" && episodes}
        {tab === "info" && info}
        {tab === "related" && related}
      </div>
    </div>
  );
}
