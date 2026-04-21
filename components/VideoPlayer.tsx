"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Hls from "hls.js";
import type { StreamSource, StreamSubtitle } from "@/lib/types";
import { PROVIDERS, type ProviderKey } from "@/lib/providers";

type SubStyle = {
  fontSize: "sm" | "md" | "lg" | "xl";
  color: "white" | "yellow" | "cyan";
  bg: "none" | "half" | "full";
};

type Toggles = {
  autoPlay: boolean;
  autoSkipIntro: boolean;
  autoNext: boolean;
};

const SUB_STYLE_DEFAULT: SubStyle = { fontSize: "md", color: "white", bg: "half" };
const TOGGLES_DEFAULT: Toggles = { autoPlay: true, autoSkipIntro: false, autoNext: false };

const FONT_SIZE_PX = { sm: 14, md: 18, lg: 24, xl: 32 };
const COLOR_HEX = { white: "#fff", yellow: "#ffeb3b", cyan: "#00e5ff" };
const BG_RGBA = { none: "rgba(0,0,0,0)", half: "rgba(0,0,0,0.55)", full: "rgba(0,0,0,0.9)" };

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function onlyEnglish(subs: StreamSubtitle[] = []): StreamSubtitle[] {
  return subs.filter(
    (s) => s && s.url && /eng|english|en[-_ ]?/i.test(s.lang || "")
  );
}

export default function VideoPlayer({
  animeId,
  episodeNumber,
  initialSources,
  initialReferer,
  initialSubtitles,
  poster,
  serverOnly = false,
}: {
  animeId: string;
  episodeNumber: number;
  initialSources: StreamSource[];
  initialReferer?: string;
  initialSubtitles?: StreamSubtitle[];
  poster?: string;
  serverOnly?: boolean;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [provider, setProvider] = useState<ProviderKey>("animekai");
  const [sources, setSources] = useState<StreamSource[]>(initialSources);
  const [referer, setReferer] = useState<string | undefined>(initialReferer);
  const [subtitles, setSubtitles] = useState<StreamSubtitle[]>(onlyEnglish(initialSubtitles));
  const [selected, setSelected] = useState<number>(() => pickDefault(initialSources));
  const [selectedSub, setSelectedSub] = useState<number>(() =>
    onlyEnglish(initialSubtitles).length ? 0 : -1
  );
  const [speed, setSpeed] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [subStyle, setSubStyle] = useState<SubStyle>(() => loadJSON("ani:substyle", SUB_STYLE_DEFAULT));
  const [toggles, setToggles] = useState<Toggles>(() => loadJSON("ani:toggles", TOGGLES_DEFAULT));
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState<"quality" | "speed" | "sub">("quality");

  useEffect(() => { saveJSON("ani:substyle", subStyle); }, [subStyle]);
  useEffect(() => { saveJSON("ani:toggles", toggles); }, [toggles]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

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
      const eng = onlyEnglish(j.subtitles || []);
      setSources(newSources);
      setReferer(j.headers?.Referer);
      setSubtitles(eng);
      setSelected(pickDefault(newSources));
      setSelectedSub(eng.length ? 0 : -1);
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

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.playbackRate = speed;
  }, [speed, src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => {
      if (toggles.autoSkipIntro && v.currentTime < 5 && v.duration > 120) {
        v.currentTime = 85;
      }
      if (toggles.autoPlay) v.play().catch(() => {});
    };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, [toggles.autoPlay, toggles.autoSkipIntro, src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => {
      if (toggles.autoNext) router.push(`/watch/${animeId}/${episodeNumber + 1}`);
    };
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, [toggles.autoNext, animeId, episodeNumber, router]);

  useEffect(() => {
    if (!animeId || !episodeNumber) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(
        `/api/watch?id=${encodeURIComponent(animeId)}&episode=${episodeNumber + 1}&provider=animekai`,
        { signal: ctrl.signal }
      ).catch(() => {});
    }, 2500);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [animeId, episodeNumber]);

  const cueCss = useMemo(() => {
    const size = FONT_SIZE_PX[subStyle.fontSize];
    const color = COLOR_HEX[subStyle.color];
    const bg = BG_RGBA[subStyle.bg];
    return `
      video::cue {
        font-size: ${size}px;
        color: ${color};
        background-color: ${bg};
        font-family: system-ui, sans-serif;
        text-shadow: 0 1px 2px rgba(0,0,0,0.9);
      }
    `;
  }, [subStyle]);

  return (
    <div className="space-y-3">
      <style dangerouslySetInnerHTML={{ __html: cueCss }} />
      {!serverOnly && (
        <div className="relative aspect-video w-full bg-black rounded-md overflow-hidden group">
          <video
            ref={videoRef}
            controls
            autoPlay={toggles.autoPlay}
            poster={poster}
            className="w-full h-full"
            playsInline
            crossOrigin="anonymous"
          >
            {subtitles.map((s, i) => (
              <track
                key={s.url}
                kind="subtitles"
                src={`/api/stream?url=${encodeURIComponent(s.url)}${
                  referer ? `&referer=${encodeURIComponent(referer)}` : ""
                }`}
                srcLang="en"
                label={s.lang || "English"}
                default={i === selectedSub}
              />
            ))}
          </video>

          {/* Floating settings button */}
          <div ref={menuRef} className="absolute top-3 right-3 z-20">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="bg-black/70 hover:bg-black/90 backdrop-blur text-white rounded-full w-10 h-10 grid place-items-center border border-white/10 shadow-lg transition"
              aria-label="Settings"
            >
              <GearIcon />
            </button>
            {menuOpen && (
              <div className="absolute top-12 right-0 w-72 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-3 text-white text-sm">
                <div className="flex gap-1 mb-3 border-b border-white/10 pb-2">
                  <TabBtn active={menuTab === "quality"} onClick={() => setMenuTab("quality")}>
                    Quality
                  </TabBtn>
                  <TabBtn active={menuTab === "speed"} onClick={() => setMenuTab("speed")}>
                    Speed
                  </TabBtn>
                  <TabBtn active={menuTab === "sub"} onClick={() => setMenuTab("sub")}>
                    Subs
                  </TabBtn>
                </div>

                {menuTab === "quality" && (
                  <div className="space-y-1 max-h-60 overflow-auto">
                    {sources.length === 0 && <p className="text-white/50">No sources.</p>}
                    {sources.map((s, i) => (
                      <MenuRow
                        key={s.url + i}
                        active={i === selected}
                        onClick={() => setSelected(i)}
                      >
                        {s.quality || `Source ${i + 1}`}
                      </MenuRow>
                    ))}
                  </div>
                )}

                {menuTab === "speed" && (
                  <div className="space-y-1">
                    {SPEEDS.map((s) => (
                      <MenuRow key={s} active={s === speed} onClick={() => setSpeed(s)}>
                        {s}x {s === 1 && <span className="text-white/40 text-xs">Normal</span>}
                      </MenuRow>
                    ))}
                  </div>
                )}

                {menuTab === "sub" && (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <MenuRow active={selectedSub === -1} onClick={() => setSelectedSub(-1)}>
                        Off
                      </MenuRow>
                      {subtitles.length === 0 && (
                        <p className="text-white/50 text-xs px-2 py-1">No English subs.</p>
                      )}
                      {subtitles.map((s, i) => (
                        <MenuRow
                          key={s.url || i}
                          active={i === selectedSub}
                          onClick={() => setSelectedSub(i)}
                        >
                          {s.lang || "English"}
                        </MenuRow>
                      ))}
                    </div>

                    {subtitles.length > 0 && (
                      <div className="border-t border-white/10 pt-2 space-y-1.5">
                        <div className="text-xs text-white/50 mb-1">Customize</div>
                        <StyleRow
                          label="Size"
                          current={subStyle.fontSize}
                          options={[["sm","S"],["md","M"],["lg","L"],["xl","XL"]] as const}
                          onPick={(v) => setSubStyle((s) => ({ ...s, fontSize: v }))}
                        />
                        <StyleRow
                          label="Color"
                          current={subStyle.color}
                          options={[["white","White"],["yellow","Yellow"],["cyan","Cyan"]] as const}
                          onPick={(v) => setSubStyle((s) => ({ ...s, color: v }))}
                        />
                        <StyleRow
                          label="BG"
                          current={subStyle.bg}
                          options={[["none","None"],["half","Half"],["full","Full"]] as const}
                          onPick={(v) => setSubStyle((s) => ({ ...s, bg: v }))}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {loading && (
            <div className="absolute inset-0 bg-black/60 grid place-items-center">
              <div className="text-sm text-white/80 animate-pulse">Switching server…</div>
            </div>
          )}
        </div>
      )}

      <TrackSync videoRef={videoRef} selectedSub={selectedSub} />

      {/* Toggles below player */}
      {!serverOnly && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <Toggle
            on={toggles.autoPlay}
            onClick={() => setToggles((t) => ({ ...t, autoPlay: !t.autoPlay }))}
            label="Auto Play"
          />
          <Toggle
            on={toggles.autoSkipIntro}
            onClick={() => setToggles((t) => ({ ...t, autoSkipIntro: !t.autoSkipIntro }))}
            label="Auto Skip Intro"
          />
          <Toggle
            on={toggles.autoNext}
            onClick={() => setToggles((t) => ({ ...t, autoNext: !t.autoNext }))}
            label="Auto Next Ep"
          />
        </div>
      )}

      {/* Server row */}
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <span className="text-muted">Server:</span>
        {PROVIDERS.map((p) => (
          <button
            key={p.key}
            onClick={() => switchServer(p.key)}
            disabled={loading}
            className={chip(p.key === provider)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-red-300">Server error: {error}</p>}
    </div>
  );
}

function TrackSync({
  videoRef,
  selectedSub,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  selectedSub: number;
}) {
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tracks = v.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = i === selectedSub ? "showing" : "disabled";
    }
  }, [selectedSub, videoRef]);
  return null;
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full border text-xs transition-colors flex items-center gap-1.5",
        on ? "bg-accent border-accent text-white" : "bg-panel border-border hover:border-accent",
      ].join(" ")}
    >
      <span className={on ? "opacity-100" : "opacity-50"}>{on ? "●" : "○"}</span>
      {label}
    </button>
  );
}

function MenuRow({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left px-3 py-1.5 rounded text-sm flex items-center justify-between transition-colors",
        active ? "bg-accent text-white" : "hover:bg-white/10",
      ].join(" ")}
    >
      <span>{children}</span>
      {active && <span>✓</span>}
    </button>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex-1 px-2 py-1 rounded text-xs font-medium transition-colors",
        active ? "bg-accent text-white" : "text-white/60 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function StyleRow<V extends string>({
  label,
  current,
  options,
  onPick,
}: {
  label: string;
  current: V;
  options: readonly (readonly [V, string])[];
  onPick: (v: V) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-white/50 text-xs w-10 shrink-0">{label}</span>
      {options.map(([v, lbl]) => (
        <button
          key={v}
          onClick={() => onPick(v)}
          className={[
            "px-2 py-0.5 rounded border text-xs transition-colors",
            v === current
              ? "bg-accent border-accent text-white"
              : "border-white/10 text-white/70 hover:border-white/40",
          ].join(" ")}
        >
          {lbl}
        </button>
      ))}
    </div>
  );
}

function chip(active: boolean) {
  return [
    "px-2 py-1 rounded border text-xs transition-colors disabled:opacity-50",
    active ? "bg-accent border-accent text-white" : "bg-panel border-border hover:border-accent",
  ].join(" ");
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
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

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const s = window.localStorage.getItem(key);
    if (!s) return fallback;
    return { ...fallback, ...JSON.parse(s) };
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
