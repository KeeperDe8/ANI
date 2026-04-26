import { NextRequest, NextResponse } from "next/server";
import { PROVIDERS, type ProviderKey } from "@/lib/providers";
import { fetchForProvider, fetchAuto } from "@/lib/watch";
import { getInfo } from "@/lib/cache";
import { displayTitle } from "@/lib/types";

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

  // Resolve title from Jikan (cached) to drive provider title-search
  let animeTitle: string;
  try {
    const info = await getInfo(id);
    animeTitle = displayTitle(info.title);
  } catch {
    return NextResponse.json({ error: "anime not found" }, { status: 404 });
  }

  const headers = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" };

  if (provider === "auto") {
    try {
      const result = await fetchAuto(animeTitle, episodeNumber);
      return NextResponse.json(result, { headers });
    } catch (e) {
      const errs =
        e instanceof AggregateError
          ? e.errors.map((x) => (x instanceof Error ? x.message : String(x)))
          : [String(e)];
      return NextResponse.json({ error: "all providers failed", details: errs }, { status: 502 });
    }
  }

  try {
    const result = await fetchForProvider(
      animeTitle,
      episodeNumber,
      provider as Exclude<ProviderKey, "auto">
    );
    return NextResponse.json(result, { headers });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }
}
