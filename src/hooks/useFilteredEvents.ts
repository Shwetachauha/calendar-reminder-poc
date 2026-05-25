"use client";

import { useMemo } from "react";
import { useEventStore } from "@/store/eventStore";

export const useFilteredEvents = () => {
  const { events, filters } = useEventStore();

  return useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !filters.search ||
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDate = !filters.date || event.date === filters.date;

      return matchesSearch && matchesDate;
    });
  }, [events, filters]);
};
