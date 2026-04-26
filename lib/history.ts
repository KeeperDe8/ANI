import { loadJSON, saveJSON } from "./storage";

const PROFILE_KEY = "ani:profile:v1";
const HISTORY_KEY = "ani:history:v1";
const MAX_ENTRIES = 60;

export type Profile = { id: string; name: string };

export type HistoryEntry = {
  animeId: string;
  animeTitle: string;
  poster?: string;
  episode: number;
  episodeId?: string;
  time: number;
  duration: number;
  updatedAt: number;
};

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export function getProfile(): Profile {
  if (typeof window === "undefined") return { id: "server", name: "You" };
  const existing = loadJSON<Profile | null>(PROFILE_KEY, null);
  if (existing && existing.id) return existing;
  const fresh: Profile = { id: randomId(), name: "You" };
  saveJSON(PROFILE_KEY, fresh);
  return fresh;
}

export function setProfileName(name: string) {
  const p = getProfile();
  saveJSON(PROFILE_KEY, { ...p, name: name.trim() || "You" });
}

function readAll(): HistoryEntry[] {
  return loadJSON<HistoryEntry[]>(HISTORY_KEY, []);
}

function writeAll(entries: HistoryEntry[]) {
  saveJSON(HISTORY_KEY, entries);
}

function entryKey(animeId: string, episode: number) {
  return `${animeId}|${episode}`;
}

export function getProgress(animeId: string, episode: number): HistoryEntry | null {
  const all = readAll();
  return all.find((e) => entryKey(e.animeId, e.episode) === entryKey(animeId, episode)) || null;
}

export function setProgress(entry: Omit<HistoryEntry, "updatedAt"> & { updatedAt?: number }) {
  const now = entry.updatedAt ?? Date.now();
  const all = readAll().filter((e) => entryKey(e.animeId, e.episode) !== entryKey(entry.animeId, entry.episode));
  all.unshift({ ...entry, updatedAt: now });
  while (all.length > MAX_ENTRIES) all.pop();
  writeAll(all);
}

export function getAllProgress(): HistoryEntry[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function clearHistory() {
  writeAll([]);
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
