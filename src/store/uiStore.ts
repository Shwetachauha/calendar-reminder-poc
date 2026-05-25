"use client";

import { create } from "zustand";
import { CalendarEvent } from "@/types/event";

interface UIState {
  isEventModalOpen: boolean;
  selectedEvent: CalendarEvent | null;
  isDrawerOpen: boolean;
  openEventModal: () => void;
  closeEventModal: () => void;
  openDrawer: (event: CalendarEvent) => void;
  closeDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isEventModalOpen: false,
  selectedEvent: null,
  isDrawerOpen: false,
  openEventModal: () => set({ isEventModalOpen: true }),
  closeEventModal: () => set({ isEventModalOpen: false }),
  openDrawer: (event) => set({ selectedEvent: event, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, selectedEvent: null }),
}));
