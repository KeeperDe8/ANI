export type ProviderKey = "auto" | "animeunity" | "animekai" | "kickassanime";

export const PROVIDERS: { key: ProviderKey; label: string }[] = [
  { key: "auto", label: "Auto" },
  { key: "kickassanime", label: "KickAssAnime" },
  { key: "animeunity", label: "AnimeUnity" },
  { key: "animekai", label: "AnimeKai" },
];

export const REAL_PROVIDERS: Exclude<ProviderKey, "auto">[] = [
  "kickassanime",
  "animeunity",
  "animekai",
];
