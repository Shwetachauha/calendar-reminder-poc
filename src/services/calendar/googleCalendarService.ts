import dayjs from "dayjs";
import { CalendarEvent } from "@/types/event";

const GOOGLE_CALENDAR_EVENTS_ENDPOINT = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

const getEventDateTime = (event: CalendarEvent) => {
  const parsed = dayjs(`${event.date} ${event.time}`);
  if (!parsed.isValid()) {
    throw new Error("Invalid event date/time");
  }

  return parsed;
};

export const syncGoogleCalendar = async (event: CalendarEvent, googleAccessToken: string) => {
  const start = getEventDateTime(event);
  const end = start.add(30, "minute");
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const response = await fetch(GOOGLE_CALENDAR_EVENTS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${googleAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: event.title,
      description: event.description,
      start: {
        dateTime: start.toISOString(),
        timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone,
      },
      reminders: event.reminderEnabled
        ? {
            useDefault: false,
            overrides: [{ method: "popup", minutes: event.reminderMinutes }],
          }
        : {
            useDefault: false,
            overrides: [],
          },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create event in Google Calendar");
  }

  return response.json();
};
