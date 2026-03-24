"use client";

import { useCallback, useEffect, useState } from "react";
import type { WeatherData } from "@/types";

function getTimeOfDay(): WeatherData["timeOfDay"] {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function mapCondition(code: number): WeatherData["condition"] {
  if (code === 0 || code === 1) return "clear";
  if (code >= 2 && code <= 3) return "cloudy";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 95 && code <= 99) return "storm";
  if (code === 45 || code === 48) return "fog";
  return "clear";
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`,
      );
      if (!res.ok) throw new Error("Weather API failed");
      const data = await res.json();
      const current = data.current;

      setWeather({
        condition: mapCondition(current.weather_code),
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        timeOfDay: getTimeOfDay(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
      // Fallback to time-based weather
      setWeather({
        condition: "clear",
        temperature: 20,
        humidity: 50,
        windSpeed: 5,
        timeOfDay: getTimeOfDay(),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const detectAndFetch = useCallback(() => {
    if (!navigator.geolocation) {
      setWeather({
        condition: "clear",
        temperature: 20,
        humidity: 50,
        windSpeed: 5,
        timeOfDay: getTimeOfDay(),
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
        // Fallback on geolocation denied
        setWeather({
          condition: "clear",
          temperature: 20,
          humidity: 50,
          windSpeed: 5,
          timeOfDay: getTimeOfDay(),
        });
      },
    );
  }, [fetchWeather]);

  useEffect(() => {
    detectAndFetch();
  }, [detectAndFetch]);

  return { weather, loading, error, refetch: detectAndFetch };
}
