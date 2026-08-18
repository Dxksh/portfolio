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

interface City {
  name: string;
  latitude: number;
  longitude: number;
}

const CITIES: City[] = [
  { name: "Liverpool", latitude: 53.4084, longitude: -2.9916 },
  { name: "Dubai", latitude: 25.2048, longitude: 55.2708 },
];

interface WeatherReading {
  city: string;
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

async function fetchCityWeather(city: City, signal: AbortSignal): Promise<WeatherReading> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code&timezone=auto`,
    { signal }
  );
  if (!res.ok) throw new Error(`Weather request failed for ${city.name}: ${res.status}`);
  const data = (await res.json()) as { current?: { temperature_2m?: number; weather_code?: number } };
  const temperature = data.current?.temperature_2m;
  const code = data.current?.weather_code;
  if (typeof temperature !== "number" || typeof code !== "number") {
    throw new Error(`Weather response missing current values for ${city.name}`);
  }
  return { city: city.name, temperatureC: Math.round(temperature), code };
}

const shellClass = "flex h-full flex-col rounded-xl border border-edge bg-surface p-4 backdrop-blur";
const tileClass =
  "flex flex-col items-center justify-center gap-1.5 rounded-lg border border-edge bg-surface-strong px-2 py-3 text-center";
const pulseClass = "animate-pulse rounded bg-edge motion-reduce:animate-none";

export function WeatherWidget() {
  // null = still loading, [] = every city failed, otherwise the cities that resolved
  const [readings, setReadings] = useState<WeatherReading[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.allSettled(CITIES.map((city) => fetchCityWeather(city, controller.signal))).then((results) => {
      // Unmounted: every rejection here is an AbortError, so ignore the batch entirely.
      if (controller.signal.aborted) return;
      // Rejected cities (network, non-200, malformed body) simply drop out of the list.
      setReadings(results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : [])));
    });
    return () => controller.abort();
  }, []);

  // Only a total failure hides the widget; one surviving city still renders.
  if (readings !== null && readings.length === 0) return null;

  const columnsClass = readings !== null && readings.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className={shellClass}>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Weather</p>
      <div className={`mt-3 grid flex-1 gap-2 ${columnsClass}`}>
        {readings === null
          ? CITIES.map((city) => (
              <div key={city.name} className={tileClass}>
                <div className={`h-5 w-16 ${pulseClass}`} />
                <div className={`size-6 ${pulseClass}`} />
                <div className={`h-8 w-14 sm:h-9 ${pulseClass}`} />
                <div className={`h-4 w-20 ${pulseClass}`} />
              </div>
            ))
          : readings.map((reading) => {
              const { label, Icon } = describeWeatherCode(reading.code);
              return (
                <div key={reading.city} className={tileClass}>
                  <p className="text-sm font-medium text-ink">{reading.city}</p>
                  <Icon className="size-6 text-accent" aria-hidden="true" />
                  <p className="text-2xl font-bold tabular-nums sm:text-3xl">{reading.temperatureC}°</p>
                  <p className="text-xs text-ink-muted">{label}</p>
                </div>
              );
            })}
      </div>
    </div>
  );
}
