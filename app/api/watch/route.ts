import { NextRequest, NextResponse } from "next/server";
import { consumet } from "@/lib/consumet";
import { PROVIDERS, REAL_PROVIDERS, type ProviderKey } from "@/lib/providers";
import { cached } from "@/lib/memcache";
import type { WatchResponse } from "@/lib/types";

const TTL = 5 * 60 * 1000;

async function fetchFor(
  id: string,
  episodeNumber: number,
  provider: Exclude<ProviderKey, "auto">
): Promise<WatchResponse & { provider: string; episodeId: string }> {
  const key = `watch|${id}|${episodeNumber}|${provider}`;
  return cached(key, TTL, async () => {
    const info = await consumet.info(id, provider);
    const ep = (info.episodes || []).find((e) => e.number === episodeNumber);
    if (!ep) throw new Error(`episode ${episodeNumber} not found on ${provider}`);
    const watch = await consumet.watch(ep.id, provider);
    if (!watch.sources?.length) throw new Error(`no sources from ${provider}`);
    return { provider, episodeId: ep.id, ...watch };
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const episodeParam = req.nextUrl.searchParams.get("episode");
  const provider = (req.nextUrl.searchParams.get("provider") || "auto") as ProviderKey;
  if (!id || !episodeParam) {
    return NextResponse.json({ error: "missing id or episode" }, { status: 400 });
  }
  if (!PROVIDERS.find((p) => p.key === provider)) {
    return NextResponse.json({ error: "unknown provider" }, { status: 400 });
  }
  const episodeNumber = Number(episodeParam);
  if (!Number.isFinite(episodeNumber)) {
    return NextResponse.json({ error: "bad episode" }, { status: 400 });
  }

  const headers = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" };

  if (provider === "auto") {
    try {
      const result = await Promise.any(
        REAL_PROVIDERS.map((p) => fetchFor(id, episodeNumber, p))
      );
      return NextResponse.json(result, { headers });
    } catch (e) {
      const errs = e instanceof AggregateError
        ? e.errors.map((x) => (x instanceof Error ? x.message : String(x)))
        : [String(e)];
      return NextResponse.json({ error: "all providers failed", details: errs }, { status: 502 });
    }
  }

  try {
    const result = await fetchFor(id, episodeNumber, provider);
    return NextResponse.json(result, { headers });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }
}
