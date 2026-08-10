function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(7);
const STARS = Array.from({ length: 56 }, () => ({
  cx: +(rand() * 1440).toFixed(1),
  cy: +(rand() * 430).toFixed(1),
  r: +(0.6 + rand() * 1.1).toFixed(2),
  o: +(0.35 + rand() * 0.65).toFixed(2),
}));

export function Wallpaper() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop className="wallpaper-stop" offset="0" stopColor="var(--wall-sky-1)" />
            <stop className="wallpaper-stop" offset="1" stopColor="var(--wall-sky-2)" />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0" stopColor="var(--wall-glow)" stopOpacity="0.5" />
            <stop offset="1" stopColor="var(--wall-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#sky)" />
        <g className="wallpaper-fill" style={{ opacity: "var(--stars-opacity)" }}>
          {STARS.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} opacity={s.o} fill="#ffffff" />
          ))}
        </g>
        <g className="wallpaper-fill" style={{ opacity: "var(--moon-opacity)" }}>
          <circle cx="1120" cy="170" r="120" fill="url(#glow)" />
          <circle cx="1120" cy="170" r="42" fill="var(--wall-glow)" />
          <circle className="wallpaper-fill" cx="1138" cy="156" r="36" fill="var(--wall-sky-1)" />
        </g>
        <g className="wallpaper-fill" style={{ opacity: "var(--sun-opacity)" }}>
          <circle cx="1120" cy="170" r="130" fill="url(#glow)" />
          <circle cx="1120" cy="170" r="52" fill="var(--wall-glow)" />
        </g>
        <path className="wallpaper-fill" fill="var(--wall-hill-1)" d="M0 620 C 240 560, 480 588, 720 540 C 960 492, 1200 556, 1440 512 L 1440 900 L 0 900 Z" />
        <path className="wallpaper-fill" fill="var(--wall-hill-2)" d="M0 706 C 260 648, 520 682, 780 640 C 1040 598, 1260 664, 1440 622 L 1440 900 L 0 900 Z" />
        <path className="wallpaper-fill" fill="var(--wall-hill-3)" d="M0 788 C 300 726, 600 764, 900 722 C 1150 688, 1330 744, 1440 712 L 1440 900 L 0 900 Z" />
      </svg>
    </div>
  );
}
