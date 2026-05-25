import { calendarSyncApi } from "@/services/api/eventsApi";

export const syncOutlookCalendar = async (eventId: string, token: string) => {
  return calendarSyncApi({ provider: "outlook", eventId }, token);
};
