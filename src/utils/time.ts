import dayjs from "dayjs";
import { CalendarEvent } from "@/types/event";

export const getEventDateTime = (event: CalendarEvent) => {
  return dayjs(`${event.date} ${event.time}`);
};

export const getReminderDateTime = (event: CalendarEvent) => {
  return getEventDateTime(event).subtract(event.reminderMinutes, "minute");
};

export const formatEventDate = (date: string) => dayjs(date).format("MMM DD, YYYY");

export const formatEventTime = (time: string) => dayjs(time, "HH:mm").format("hh:mm A");
