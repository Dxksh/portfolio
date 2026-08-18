"use client";

import { Download, FileText } from "lucide-react";
import { Modal } from "@/components/Modal";
import { useSound } from "@/components/SoundProvider";
import { profile } from "@/content/profile";
import { useMediaQuery } from "@/lib/use-media-query";

// A viewer hint, not a guarantee: Chrome/Edge hide their PDF chrome for it, Firefox and
// Safari ignore it. Either way the file still resolves, so it only ever affects the look.
const EMBED_SRC = `${profile.cvPath}#toolbar=0&navpanes=0`;

// Embedded PDFs are unreliable on phones — iOS Safari renders only the first page and
// Android Chrome tends to turn the frame into a download prompt — so the iframe is mounted
// only where it actually works. Deciding with the media query (rather than a `hidden` class)
// keeps the mobile path from fetching the PDF at all, and leaves exactly one set of controls
// in the DOM so the modal's focus trap can never land on a display:none element.
const EMBED_QUERY = "(min-width: 640px) and (min-height: 600px)";

interface ResumeWindowProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeWindow({ open, onClose }: ResumeWindowProps) {
  const canEmbed = useMediaQuery(EMBED_QUERY);
  const { playClick } = useSound();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Resume"
      contentClassName="p-0"
      windowClassName="w-full max-w-lg sm:max-w-3xl"
    >
      {canEmbed ? (
        <div className="bg-white">
          <iframe
            src={EMBED_SRC}
            title="Daksh Singhvi CV"
            // Out of the tab order deliberately: an iframe is tabbable by default but isn't
            // matched by the Modal's focus-trap selector, so Tab would drop focus into the
            // PDF viewer's own document — where keydowns no longer reach us and Escape
            // stops closing the window. Mouse scrolling inside the PDF still works.
            tabIndex={-1}
            className="block h-[70vh] w-full border-0 bg-white"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <FileText className="size-4 text-accent" aria-hidden="true" />
            {profile.name} — CV
          </p>
          <p className="text-sm text-ink-muted">
            My CV is a PDF, and mobile browsers can&apos;t reliably preview one inside a page. Open it in a
            new tab or download it below.
          </p>
          <a
            href={profile.cvPath}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            className="text-sm font-medium text-accent hover:underline"
          >
            Open in a new tab ↗
          </a>
        </div>
      )}
      <div className="flex justify-center border-t border-edge bg-surface-strong px-4 py-3">
        <a
          href={profile.cvPath}
          download
          onClick={playClick}
          aria-label="Download CV (PDF)"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Download className="size-4" aria-hidden="true" />
          Download
        </a>
      </div>
    </Modal>
  );
}
