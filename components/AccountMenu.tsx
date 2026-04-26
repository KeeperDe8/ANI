"use client";

import { useEffect, useRef, useState } from "react";
import { clearHistory, getProfile, setProfileName, type Profile } from "@/lib/history";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const initials = (profile?.name || "You").slice(0, 2).toUpperCase();

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account"
        className="w-8 h-8 rounded-full p-0.5 cursor-pointer shrink-0 border-0"
        style={{ background: "conic-gradient(from 215deg,#8b5cf6,#ec4899,#8b5cf6)" }}
      >
        <span className="w-full h-full rounded-full bg-panel grid place-items-center text-white text-[11px] font-bold">
          {initials}
        </span>
      </button>
      {open && profile && (
        <div className="absolute right-0 top-10 w-60 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-3 text-white text-sm z-50">
          <div className="text-xs text-white/50 mb-1">Signed in as</div>
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setProfileName(name);
                setProfile({ ...profile, name: name.trim() || "You" });
                setEditing(false);
              }}
              className="flex gap-1"
            >
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent border border-white/10 rounded px-2 py-1 text-sm outline-none focus:border-accent"
              />
              <button className="text-xs px-2 py-1 rounded bg-accent">OK</button>
            </form>
          ) : (
            <button
              onClick={() => { setName(profile.name); setEditing(true); }}
              className="w-full text-left font-medium hover:text-accent transition"
            >
              {profile.name}
              <span className="ml-2 text-xs text-white/40">edit</span>
            </button>
          )}
          <div className="border-t border-white/10 my-2" />
          <button
            onClick={() => {
              if (confirm("Clear all watch history?")) {
                clearHistory();
                setOpen(false);
              }
            }}
            className="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-white/10 text-red-300"
          >
            Clear watch history
          </button>
        </div>
      )}
    </div>
  );
}
