export type CalendarProvider = "google" | "outlook";

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  reminderEnabled: boolean;
  reminderMinutes: number;
  provider: CalendarProvider;
  createdAt: string;
  updatedAt: string;
  reminderNotified?: boolean;
}

export interface EventPayload {
  title: string;
  description: string;
  date: string;
  time: string;
  reminderEnabled: boolean;
  reminderMinutes: number;
  provider: CalendarProvider;
}

export interface EventFilters {
  search: string;
  date: string;
}
