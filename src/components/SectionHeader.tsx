export function SectionHeader({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="mb-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {blurb && <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">{blurb}</p>}
    </div>
  );
}
