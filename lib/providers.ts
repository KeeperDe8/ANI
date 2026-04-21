export type ProviderKey = "auto" | "animekai" | "animepahe" | "kickassanime";

export const PROVIDERS: { key: ProviderKey; label: string }[] = [
  { key: "auto", label: "Auto" },
  { key: "animekai", label: "AnimeKai" },
  { key: "animepahe", label: "AnimePahe" },
  { key: "kickassanime", label: "KickAss" },
];

export const REAL_PROVIDERS: Exclude<ProviderKey, "auto">[] = [
  "animekai",
  "animepahe",
  "kickassanime",
];
