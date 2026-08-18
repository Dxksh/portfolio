"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { favoriteTracks, type Track } from "@/content/tracks";

export function NowPlayingWidget() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    // SSR-safe: picks a random track only after mount, by design (avoids hydration mismatch)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrack(favoriteTracks[Math.floor(Math.random() * favoriteTracks.length)]);
  }, []);

  if (!track) {
    return (
      <div className="flex h-full flex-col justify-between rounded-xl border border-edge bg-surface p-4 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Now playing</p>
        <div className="mt-3 h-8 w-32 animate-pulse rounded bg-edge motion-reduce:animate-none" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-edge bg-surface p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Now playing</p>
        <div className="flex h-4 items-end gap-0.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="eq-bar w-1 rounded-full bg-accent motion-reduce:animate-none" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
      <div className="mt-3">
        <p className="truncate text-base font-semibold">{track.title}</p>
        <p className="truncate text-sm text-ink-muted">{track.artist}</p>
      </div>
      <a
        href={track.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
      >
        Open in Spotify <ArrowUpRight className="size-3" />
      </a>
    </div>
  );
}
