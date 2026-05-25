"use client";

import { CalendarEvent } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";

interface CalendarListProps {
  events: CalendarEvent[];
  onView: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export const CalendarList = ({ events, onView, onDelete }: CalendarListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onView={onView} onDelete={onDelete} />
      ))}
    </div>
  );
};
