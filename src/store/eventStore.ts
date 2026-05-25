"use client";

import { create } from "zustand";
import { createEventApi, deleteEventApi, fetchEventsApi, updateEventApi } from "@/services/api/eventsApi";
import { syncGoogleCalendar } from "@/services/calendar/googleCalendarService";
import { syncOutlookCalendar } from "@/services/calendar/outlookCalendarService";
import { useIntegrationStore } from "@/store/integrationStore";
import { CalendarEvent, EventFilters, EventPayload } from "@/types/event";

interface EventState {
  events: CalendarEvent[];
  filters: EventFilters;
  isLoading: boolean;
  setFilters: (value: Partial<EventFilters>) => void;
  fetchEvents: (userId: string, token: string) => Promise<void>;
  createEvent: (payload: EventPayload & { userId: string }, token: string) => Promise<CalendarEvent>;
  updateEvent: (eventId: string, payload: Partial<EventPayload>, token: string) => Promise<void>;
  deleteEvent: (eventId: string, token: string) => Promise<void>;
  markReminderNotified: (eventId: string) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  filters: {
    search: "",
    date: "",
  },
  isLoading: false,
  setFilters: (value) => set((state) => ({ filters: { ...state.filters, ...value } })),
  fetchEvents: async (userId, token) => {
    set({ isLoading: true });
    try {
      const data = await fetchEventsApi(userId, token);
      set({ events: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  createEvent: async (payload, token) => {
    const { isProviderConnected, markSyncError, markSyncSuccess } = useIntegrationStore.getState();
    if (!isProviderConnected(payload.provider)) {
      const providerLabel = payload.provider === "google" ? "Google" : "Outlook";
      const message = `${providerLabel} account is not connected`;
      markSyncError(payload.provider, message);
      throw new Error(message);
    }

    set({ isLoading: true });
    try {
      const created = await createEventApi(payload, token);

      if (created.provider === "google") {
        await syncGoogleCalendar(created.id, token);
      } else {
        await syncOutlookCalendar(created.id, token);
      }

      markSyncSuccess(created.provider, created.id);

      set((state) => ({
        events: [created, ...state.events],
        isLoading: false,
      }));

      return created;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed provider sync";
      markSyncError(payload.provider, message);
      set({ isLoading: false });
      throw error;
    }
  },
  updateEvent: async (eventId, payload, token) => {
    set({ isLoading: true });
    try {
      const updated = await updateEventApi(eventId, payload, token);
      set((state) => ({
        events: state.events.map((item) => (item.id === eventId ? updated : item)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  deleteEvent: async (eventId, token) => {
    set({ isLoading: true });
    try {
      await deleteEventApi(eventId, token);
      set((state) => ({
        events: state.events.filter((item) => item.id !== eventId),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  markReminderNotified: (eventId) => {
    const current = get().events;
    set({
      events: current.map((item) =>
        item.id === eventId ? { ...item, reminderNotified: true } : item,
      ),
    });
  },
}));
