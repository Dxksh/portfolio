"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { useSound } from "@/components/SoundProvider";
import { photos, type Photo } from "@/content/photos";

export function Photos() {
  const [openPhoto, setOpenPhoto] = useState<Photo | null>(null);
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <button
                key={photo.src}
                onClick={() => {
                  playClick();
                  setOpenPhoto(photo);
                }}
                className="group aspect-square overflow-hidden rounded-xl border border-edge"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </Reveal>
      )}
      <Modal
        open={openPhoto !== null}
        onClose={() => {
          setOpenPhoto(null);
        }}
        title={openPhoto?.alt ?? "Photo"}
      >
        {openPhoto && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={openPhoto.src} alt={openPhoto.alt} className="w-full rounded-lg" />
            {openPhoto.caption && <p className="mt-2 text-sm text-ink-muted">{openPhoto.caption}</p>}
          </div>
        )}
      </Modal>
    </section>
  );
}
