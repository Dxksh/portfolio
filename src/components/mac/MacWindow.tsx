import type { ReactNode } from "react";

interface MacWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  onClose?: () => void;
}

export function MacWindow({ title, children, className, contentClassName, onClose }: MacWindowProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-edge bg-surface shadow-window backdrop-blur-xl ${className ?? ""}`}
    >
      <div className="flex h-9 items-center gap-2 border-b border-edge bg-surface-strong px-3">
        <span className="flex items-center gap-1.5">
          {onClose ? (
            <button
              onClick={onClose}
              aria-label={`Minimise ${title}`}
              className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57]"
            >
              <span className="text-[9px] leading-none text-black/60 opacity-0 group-hover:opacity-100">×</span>
            </button>
          ) : (
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]/90" aria-hidden="true" />
          )}
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/90" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/90" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 truncate pr-14 text-center text-xs font-medium text-ink-muted">
          {title}
        </span>
      </div>
      <div className={contentClassName ?? "p-4 sm:p-5"}>{children}</div>
    </div>
  );
}
