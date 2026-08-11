import { useState, useCallback } from "react";
import type { Trip } from "../types";

const TRIPS_KEY = "nomad-trips-v1";
const RESIDENCE_KEY = "nomad-residence-v1";

function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    return raw ? (JSON.parse(raw) as Trip[]) : [];
  } catch {
    return [];
  }
}

function loadResidence(): string {
  return localStorage.getItem(RESIDENCE_KEY) ?? "";
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function useTripTracker() {
  const [trips, setTrips] = useState<Trip[]>(loadTrips);
  const [residenceCountry, setResidenceCountryState] = useState<string>(loadResidence);

  const setResidenceCountry = useCallback((code: string) => {
    setResidenceCountryState(code);
    if (code) localStorage.setItem(RESIDENCE_KEY, code);
    else localStorage.removeItem(RESIDENCE_KEY);
  }, []);

  const addTrip = useCallback((draft: Omit<Trip, "id">) => {
    setTrips((prev) => {
      const next = [...prev, { ...draft, id: uid() }];
      localStorage.setItem(TRIPS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeTrip = useCallback((id: string) => {
    setTrips((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem(TRIPS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setTrips([]);
    localStorage.removeItem(TRIPS_KEY);
  }, []);

  return { trips, addTrip, removeTrip, clearAll, residenceCountry, setResidenceCountry };
}
