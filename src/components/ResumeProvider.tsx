"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ResumeWindow } from "@/components/ResumeWindow";

interface ResumeContextValue {
  resumeOpen: boolean;
  openResume: () => void;
  closeResume: () => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

/**
 * Owns the single résumé window so sibling entry points (dock, menu bar, contact tiles) can
 * all open the same one. Mounted once in the root layout, inside SoundProvider.
 */
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeOpen, setResumeOpen] = useState(false);
  const openResume = useCallback(() => setResumeOpen(true), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const value = useMemo(
    () => ({ resumeOpen, openResume, closeResume }),
    [resumeOpen, openResume, closeResume]
  );

  return (
    <ResumeContext.Provider value={value}>
      {children}
      <ResumeWindow open={resumeOpen} onClose={closeResume} />
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used inside ResumeProvider");
  return ctx;
}
