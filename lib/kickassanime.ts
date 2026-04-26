import type { WatchResponse } from "./types";

const BASE = "https://www.kickass-anime.ro";
const PLAYER_BASE = "https://krussdomi.com";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: BASE + "/",
  Accept: "application/json",
};

async function kasGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`KAS ${path} → ${res.status}`);
  return res.json();
}

async function kasPost(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { ...HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`KAS POST ${path} → ${res.status}`);
  return res.json();
}

function titleSim(a: string, b: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const na = norm(a);
  const nb = norm(b);
  if (na === nb) return 1;
  if (na.startsWith(nb) || nb.startsWith(na)) return 0.9;
  const wa = new Set(na.split(" ").filter(Boolean));
  const wb = nb.split(" ").filter(Boolean);
  if (!wa.size || !wb.length) return 0;
  return wb.filter((w) => wa.has(w)).length / Math.max(wa.size, wb.length);
}

interface KasShow {
  slug: string;
  title?: string;
  title_en?: string;
  locales?: string[];
}

interface KasEpisode {
  slug: string;
  episode_number: number;
}

interface KasServer {
  name: string;
  shortName: string;
  src: string;
}

async function findSlug(title: string): Promise<string> {
  const data = await kasPost("/api/fsearch", { query: title, page: 1 }) as { result: KasShow[] };
  const results = data.result ?? [];
  if (!results.length) throw new Error(`KAS: "${title}" not found`);

  const best = results.reduce((a, b) => {
    const scoreA = Math.max(titleSim(a.title ?? a.slug, title), titleSim(a.title_en ?? "", title));
    const scoreB = Math.max(titleSim(b.title ?? b.slug, title), titleSim(b.title_en ?? "", title));
    return scoreB > scoreA ? b : a;
  });

  return best.slug;
}

async function findEpisodeSlug(showSlug: string, episodeNumber: number): Promise<string> {
  // First fetch page 1 to get the pages index
  const data = await kasGet(`/api/show/${showSlug}/episodes?page=1&lang=ja-JP`) as {
    result: KasEpisode[];
    pages: { number: number; eps: number[] }[];
  };

  let episodes: KasEpisode[] = data.result ?? [];

  // Check if episode is in first page
  let ep = episodes.find((e) => e.episode_number === episodeNumber);
  if (ep) return ep.slug;

  // Use pages index to find which page to fetch
  const pages = data.pages ?? [];
  const targetPage = pages.find((p) => p.eps.includes(episodeNumber));
  if (!targetPage) throw new Error(`KAS: episode ${episodeNumber} not in pages index`);

  const pageData = await kasGet(`/api/show/${showSlug}/episodes?page=${targetPage.number}&lang=ja-JP`) as {
    result: KasEpisode[];
  };
  episodes = pageData.result ?? [];
  ep = episodes.find((e) => e.episode_number === episodeNumber);
  if (!ep) throw new Error(`KAS: episode ${episodeNumber} not found on page ${targetPage.number}`);

  return ep.slug;
}

async function parsePlayerSources(src: string): Promise<{ url: string; subtitles: { lang: string; url: string }[] }> {
  // src is a krussdomi.com/cat-player/player?... URL
  // Add en-US lang param
  const playerUrl = new URL(src);
  playerUrl.searchParams.set("ln", "en-US");

  const res = await fetch(playerUrl.toString(), {
    headers: {
      "User-Agent": HEADERS["User-Agent"],
      Referer: BASE + "/",
      Accept: "text/html",
    },
  });
  if (!res.ok) throw new Error(`KAS player → ${res.status}`);
  const html = await res.text();

  // Data is in a props attribute with HTML-entity-encoded JSON
  // Pattern: &quot;manifest&quot;:[0,&quot;URL&quot;]
  const m3u8Match = html.match(/&quot;manifest&quot;:\[0,&quot;(https[^&]+\.m3u8)&quot;\]/);
  if (!m3u8Match) throw new Error("KAS: m3u8 URL not found in player");
  const m3u8Url = m3u8Match[1];

  // Extract subtitles: &quot;name&quot;:[0,&quot;LANG&quot;]...&quot;src&quot;:[0,&quot;URL.vtt&quot;]
  const subtitles: { lang: string; url: string }[] = [];
  const nameMatches = [...html.matchAll(/&quot;name&quot;:\[0,&quot;([^&]+)&quot;\]/g)];
  const srcMatches = [...html.matchAll(/&quot;src&quot;:\[0,&quot;(https[^&]+\.vtt[^&]*)&quot;\]/g)];

  for (let i = 0; i < Math.min(nameMatches.length, srcMatches.length); i++) {
    subtitles.push({ lang: nameMatches[i][1], url: srcMatches[i][1] });
  }

  return { url: m3u8Url, subtitles };
}

export async function kasSearchAndWatch(
  title: string,
  episodeNumber: number
): Promise<WatchResponse & { provider: string }> {
  const showSlug = await findSlug(title);
  const epSlug = await findEpisodeSlug(showSlug, episodeNumber);

  const epData = await kasGet(`/api/show/${showSlug}/episode/ep-${Math.floor(episodeNumber)}-${epSlug}`) as {
    servers: KasServer[];
  };

  const servers = epData.servers ?? [];
  // Prefer VidStreaming, fall back to first server
  const server = servers.find((s) => s.shortName === "Vid") ?? servers[0];
  if (!server) throw new Error("KAS: no servers found");

  const { url, subtitles } = await parsePlayerSources(server.src);

  return {
    provider: "kickassanime",
    sources: [{ url, isM3U8: true, quality: "auto" }],
    subtitles,
    headers: { Referer: PLAYER_BASE + "/" },
  };
}
