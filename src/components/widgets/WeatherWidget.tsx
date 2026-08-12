"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";

const LIVERPOOL_LAT = 53.4084;
const LIVERPOOL_LON = -2.9916;

interface WeatherReading {
  temperatureC: number;
  code: number;
}

function describeWeatherCode(code: number): { label: string; Icon: LucideIcon } {
  if (code === 0) return { label: "Clear sky", Icon: Sun };
  if (code === 1 || code === 2) return { label: "Partly cloudy", Icon: CloudSun };
  if (code === 3) return { label: "Overcast", Icon: Cloud };
  if (code === 45 || code === 48) return { label: "Foggy", Icon: CloudFog };
  if (code >= 51 && code <= 57) return { label: "Drizzle", Icon: CloudDrizzle };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { label: "Rain", Icon: CloudRain };
  if (code >= 71 && code <= 77) return { label: "Snow", Icon: CloudSnow };
  if (code >= 95) return { label: "Thunderstorm", Icon: CloudLightning };
  return { label: "Cloudy", Icon: Cloud };
}

export function WeatherWidget() {
  const [reading, setReading] = useState<WeatherReading | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LIVERPOOL_LAT}&longitude=${LIVERPOOL_LON}&current=temperature_2m,weather_code&timezone=Europe%2FLondon`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
        return res.json();
      })
      .then((data: { current: { temperature_2m: number; weather_code: number } }) => {
        setReading({ temperatureC: Math.round(data.current.temperature_2m), code: data.current.weather_code });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setFailed(true);
      });
    return () => controller.abort();
  }, []);

  if (failed) return null;

  if (!reading) {
    return (
      <div className="flex h-full flex-col justify-between rounded-xl border border-edge bg-surface p-4 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Liverpool, UK</p>
        <div className="mt-3 h-8 w-20 animate-pulse rounded bg-edge motion-reduce:animate-none" />
      </div>
    );
  }

  const { label, Icon } = describeWeatherCode(reading.code);

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-edge bg-surface p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Liverpool, UK</p>
      <div className="mt-3 flex items-center gap-3">
        <Icon className="size-8 text-accent" />
        <div>
          <p className="text-2xl font-bold tabular-nums">{reading.temperatureC}°</p>
          <p className="text-xs text-ink-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}
