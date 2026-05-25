import { axiosClient } from "@/services/api/axiosClient";
import { CalendarEvent, EventPayload } from "@/types/event";

const authHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchEventsApi = async (userId: string, token: string) => {
  const response = await axiosClient.get<CalendarEvent[]>("/events", {
    ...authHeader(token),
    params: { userId },
  });

  return response.data;
};

export const createEventApi = async (
  payload: EventPayload & { userId: string },
  token: string,
) => {
  const response = await axiosClient.post<CalendarEvent>("/events", payload, authHeader(token));
  return response.data;
};

export const updateEventApi = async (
  eventId: string,
  payload: Partial<EventPayload>,
  token: string,
) => {
  const response = await axiosClient.put<CalendarEvent>(`/events/${eventId}`, payload, authHeader(token));
  return response.data;
};

export const deleteEventApi = async (eventId: string, token: string) => {
  await axiosClient.delete(`/events/${eventId}`, authHeader(token));
};

export const calendarSyncApi = async (
  payload: { provider: "google" | "outlook"; eventId: string },
  token: string,
) => {
  const response = await axiosClient.post("/calendar-sync", payload, authHeader(token));
  return response.data as { success: boolean; provider: "google" | "outlook"; syncedAt: string };
};
