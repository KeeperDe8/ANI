import { NextRequest, NextResponse } from "next/server";

// Proxy for HLS playlists (.m3u8) and segments.
// Anime CDNs require a specific Referer and block cross-origin browser requests.
// We fetch server-side with the right headers, and rewrite playlist segment URLs
// so they also route through this proxy.

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  const referer = req.nextUrl.searchParams.get("referer") || "";
  if (!target) return new NextResponse("missing url", { status: 400 });

  let decoded: URL;
  try {
    decoded = new URL(target);
  } catch {
    return new NextResponse("invalid url", { status: 400 });
  }

  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
    Accept: "*/*",
  };
  if (referer) headers["Referer"] = referer;

  let upstream: Response;
  try {
    upstream = await fetch(decoded.toString(), { headers, cache: "no-store" });
  } catch (err) {
    return NextResponse.json({ error: "upstream fetch failed", detail: String(err) }, { status: 502 });
  }

  if (!upstream.ok) {
    return new NextResponse(`upstream ${upstream.status}`, { status: upstream.status });
  }

  const contentType = upstream.headers.get("content-type") || "";
  const isPlaylist =
    decoded.pathname.endsWith(".m3u8") ||
    contentType.includes("mpegurl") ||
    contentType.includes("application/vnd.apple");

  if (isPlaylist) {
    const text = await upstream.text();
    const rewritten = rewritePlaylist(text, decoded, referer);
    return new NextResponse(rewritten, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Binary segment (.ts / .m4s / .key) — stream through.
  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType || "video/mp2t",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function rewritePlaylist(text: string, baseUrl: URL, referer: string): string {
  const refParam = referer ? `&referer=${encodeURIComponent(referer)}` : "";

  return text
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      // Rewrite #EXT-X-KEY URI="..."
      if (trimmed.startsWith("#EXT-X-KEY") || trimmed.startsWith("#EXT-X-MAP")) {
        return line.replace(/URI="([^"]+)"/g, (_m, uri) => {
          const abs = absolutize(uri, baseUrl);
          return `URI="/api/stream?url=${encodeURIComponent(abs)}${refParam}"`;
        });
      }

      // Comments / tags → leave alone
      if (trimmed.startsWith("#")) return line;

      // Segment or sub-playlist URL
      const abs = absolutize(trimmed, baseUrl);
      return `/api/stream?url=${encodeURIComponent(abs)}${refParam}`;
    })
    .join("\n");
}

function absolutize(ref: string, base: URL): string {
  try {
    return new URL(ref, base).toString();
  } catch {
    return ref;
  }
}
