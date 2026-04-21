import { NextResponse } from "next/server";
import { getTrending, getPopular } from "@/lib/cache";

// JSON endpoint for client-side polling / SWR live refresh on home.
export async function GET() {
  try {
    const [trending, popular] = await Promise.all([getTrending(), getPopular()]);
    return NextResponse.json(
      { trending, popular },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }
}
