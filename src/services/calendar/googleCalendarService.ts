import { calendarSyncApi } from "@/services/api/eventsApi";

export const syncGoogleCalendar = async (eventId: string, token: string) => {
  return calendarSyncApi({ provider: "google", eventId }, token);
};
