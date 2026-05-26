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
    let message = "Failed to create event in Google Calendar";

    try {
      const body = (await response.json()) as { error?: { status?: string; message?: string } };
      const status = body?.error?.status;

      const isScopeError =
        status === "PERMISSION_DENIED" ||
        body?.error?.status === "PERMISSION_DENIED" ||
        JSON.stringify(body).includes("ACCESS_TOKEN_SCOPE_INSUFFICIENT");

      if (isScopeError || response.status === 403) {
        message =
          "Google Calendar access denied: the OAuth app is in Testing mode. " +
          "To allow any Gmail account, publish the app: " +
          "Google Cloud Console → APIs & Services → OAuth consent screen → PUBLISH APP.";
      } else if (response.status === 401) {
        message = "Google OAuth token expired. Go to Settings and reconnect Google.";
      } else {
        message = body?.error?.message ?? message;
      }
    } catch {
      // response body was not JSON, use default message
    }

    throw new Error(message);
  }

  return response.json();
};
