"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { useSound } from "@/components/SoundProvider";
import { photos } from "@/content/photos";

const label = (index: number) => photos[index]?.alt || `Photo ${index + 1} of ${photos.length}`;

// Grid and filmstrip pull the ~500px thumbnails (generated alongside the originals in
// public/photos/thumbs/); only the lightbox loads the full-size file.
const thumbSrc = (src: string) => src.replace("/photos/", "/photos/thumbs/");

/** Fades in once decoded, so images resolve gently instead of snapping in on scroll. */
function FadeImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // A cached image finishes loading before React hydrates and attaches onLoad, so that
    // event never fires and the image would sit at opacity-0 forever (every refresh, and
    // even on first load when the server is fast). Catch the already-complete case here.
    if (imgRef.current?.complete) setLoaded(true);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      // Never leave a broken image invisible — show it and let the alt text do its job.
      onError={() => setLoaded(true)}
      // Both properties in one transition — a bare `transition-opacity` here would collide
      // with the callers' hover `scale-105` and kill it.
      className={`${className ?? ""} transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

export function Photos() {
  // `index` is kept separate from `open` (rather than a nullable open-index) so it survives
  // the close animation — otherwise the window blanks out mid-fade.
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const { playClick } = useSound();

  return (
    <section id="photos" className="py-24">
      <Reveal>
        <SectionHeader eyebrow="04 · Photos" title="Life outside code" />
      </Reveal>
      {photos.length === 0 ? (
        <Reveal>
          <div className="rounded-xl border border-dashed border-edge p-10 text-center text-sm text-ink-muted">
            Photos coming soon.
          </div>
        </Reveal>
      ) : (
        <Reveal>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {photos.map((photo, i) => (
              <button
                key={photo.src}
                onClick={() => {
                  playClick();
                  setIndex(i);
                  setOpen(true);
                }}
                aria-label={`Open ${label(i)}`}
                className="group aspect-square overflow-hidden rounded-lg border border-edge bg-surface-strong"
              >
                <FadeImg
                  src={thumbSrc(photo.src)}
                  alt=""
                  className="size-full object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100"
                />
              </button>
            ))}
          </div>
        </Reveal>
      )}
      <Lightbox open={open} index={index} onIndexChange={setIndex} onClose={() => setOpen(false)} />
    </section>
  );
}

function Lightbox({
  open,
  index,
  onIndexChange,
  onClose,
}: {
  open: boolean;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const { playClick } = useSound();
  const stripRef = useRef<HTMLDivElement>(null);

  // Wrap around at both ends so the arrows never dead-end mid-gallery.
  const step = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + photos.length) % photos.length);
    },
    [index, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // preventDefault so the arrows don't also scroll the thumbnail strip or the page behind.
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  // Keep the active thumbnail in view as the selection moves along the strip.
  useEffect(() => {
    if (!open) return;
    stripRef.current
      ?.querySelector(`[data-thumb="${index}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [open, index]);

  const photo = photos[index];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Photos"
      contentClassName="p-0"
      // Keep the Modal default's height cap and scroll, or the header and thumbnail strip
      // get clipped out of reach on short viewports (phone landscape, short desktop windows).
      windowClassName="max-h-[85svh] w-full max-w-5xl overflow-y-auto"
    >
      {photo && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5">
            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              <X className="size-4" aria-hidden="true" />
              Close
            </button>
            <p aria-live="polite" className="font-mono text-xs text-ink-muted">
              {index + 1} of {photos.length}
            </p>
          </div>

          {/* Fixed-height stage: without it the window resizes between portrait and landscape
              shots, and collapses entirely while the next file decodes. */}
          <div className="relative flex h-[55svh] items-center justify-center bg-black/85">
            {/* Deliberately no `key` — remounting per photo would reset the fade to
                transparent and drop the element's intrinsic size, flashing on every step.
                Reusing one element lets the browser hold the current frame until the next
                one is painted. */}
            <FadeImg
              src={photo.src}
              alt={label(index)}
              className="max-h-full max-w-full object-contain"
            />
            {photos.length > 1 && (
              <>
                <ArrowButton side="left" onClick={() => step(-1)} />
                <ArrowButton side="right" onClick={() => step(1)} />
              </>
            )}
          </div>

          {photo.caption && (
            <p className="px-4 pt-3 text-center text-sm text-ink-muted">{photo.caption}</p>
          )}

          {photos.length > 1 && (
            <div
              ref={stripRef}
              className="flex gap-2 overflow-x-auto border-t border-edge bg-surface-strong p-3"
            >
              {photos.map((thumb, i) => (
                <button
                  key={thumb.src}
                  data-thumb={i}
                  onClick={() => {
                    playClick();
                    onIndexChange(i);
                  }}
                  aria-label={`Show ${label(i)}`}
                  aria-current={i === index}
                  className={`size-14 shrink-0 overflow-hidden rounded-md border transition-opacity ${
                    i === index ? "border-accent opacity-100" : "border-edge opacity-60 hover:opacity-100"
                  }`}
                >
                  <FadeImg src={thumbSrc(thumb.src)} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function ArrowButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const { playClick } = useSound();
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={() => {
        playClick();
        onClick();
      }}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/70 ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
