"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import type { StreamSource } from "@/lib/types";
import { PROVIDERS, type ProviderKey } from "@/lib/providers";

export default function VideoPlayer({
  animeId,
  episodeNumber,
  initialSources,
  initialReferer,
  poster,
  serverOnly = false,
}: {
  animeId: string;
  episodeNumber: number;
  initialSources: StreamSource[];
  initialReferer?: string;
  poster?: string;
  serverOnly?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [provider, setProvider] = useState<ProviderKey>("animekai");
  const [sources, setSources] = useState<StreamSource[]>(initialSources);
  const [referer, setReferer] = useState<string | undefined>(initialReferer);
  const [selected, setSelected] = useState<number>(() => pickDefault(initialSources));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function switchServer(next: ProviderKey) {
    if (next === provider && sources.length) return;
    setProvider(next);
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(
        `/api/watch?id=${encodeURIComponent(animeId)}&episode=${episodeNumber}&provider=${next}`
      );
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `http ${r.status}`);
      const newSources: StreamSource[] = j.sources || [];
      if (!newSources.length) throw new Error("no sources");
      setSources(newSources);
      setReferer(j.headers?.Referer);
      setSelected(pickDefault(newSources));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const src = sources[selected];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const proxied = `/api/stream?url=${encodeURIComponent(src.url)}${
      referer ? `&referer=${encodeURIComponent(referer)}` : ""
    }`;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isM3U8 = src.isM3U8 ?? src.url.includes(".m3u8");

    if (isM3U8 && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(proxied);
      hls.attachMedia(video);
      hlsRef.current = hls;
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) console.error("HLS fatal error:", data);
      });
    } else {
      video.src = proxied;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, referer]);

  // Prefetch next episode sources in background so Next click is instant.
  useEffect(() => {
    if (!animeId || !episodeNumber) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(
        `/api/watch?id=${encodeURIComponent(animeId)}&episode=${episodeNumber + 1}&provider=animekai`,
        { signal: ctrl.signal }
      ).catch(() => {});
    }, 2500);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [animeId, episodeNumber]);

  return (
    <div className="space-y-3">
      {!serverOnly && (
        <div className="relative aspect-video w-full bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            controls
            autoPlay
            poster={poster}
            className="w-full h-full"
            playsInline
          />
          {loading && (
            <div className="absolute inset-0 bg-black/60 grid place-items-center">
              <div className="text-sm text-white/80 animate-pulse">Switching server…</div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center text-sm">
        <span className="text-muted">Server:</span>
        {PROVIDERS.map((p) => (
          <button
            key={p.key}
            onClick={() => switchServer(p.key)}
            disabled={loading}
            className={[
              "px-2 py-1 rounded border text-xs transition-colors disabled:opacity-50",
              p.key === provider
                ? "bg-accent border-accent text-white"
                : "bg-panel border-border hover:border-accent",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-300">Server error: {error}</p>
      )}

      {sources.length > 1 && !serverOnly && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-muted">Quality:</span>
          {sources.map((s, i) => (
            <button
              key={s.url + i}
              onClick={() => setSelected(i)}
              className={[
                "px-2 py-1 rounded border text-xs transition-colors",
                i === selected
                  ? "bg-accent border-accent text-white"
                  : "bg-panel border-border hover:border-accent",
              ].join(" ")}
            >
              {s.quality || `source ${i + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function pickDefault(sources: StreamSource[]): number {
  const preferred = ["1080p", "720p", "auto", "default"];
  for (const q of preferred) {
    const idx = sources.findIndex((s) => (s.quality || "").toLowerCase() === q);
    if (idx >= 0) return idx;
  }
  return 0;
}
