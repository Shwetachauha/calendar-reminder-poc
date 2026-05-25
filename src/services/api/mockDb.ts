import { STORAGE_KEYS } from "@/constants/storage";
import { mockEvents } from "@/mock/events";
import { CalendarEvent } from "@/types/event";

const isClient = () => typeof window !== "undefined";

export const getStoredEvents = (): CalendarEvent[] => {
  if (!isClient()) {
    return mockEvents;
  }

  const cached = window.localStorage.getItem(STORAGE_KEYS.events);
  if (!cached) {
    window.localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(mockEvents));
    return mockEvents;
  }

  try {
    return JSON.parse(cached) as CalendarEvent[];
  } catch {
    window.localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(mockEvents));
    return mockEvents;
  }
};

export const setStoredEvents = (events: CalendarEvent[]) => {
  if (!isClient()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
};
