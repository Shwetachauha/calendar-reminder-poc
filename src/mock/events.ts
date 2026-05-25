import dayjs from "dayjs";
import { CalendarEvent } from "@/types/event";

const now = dayjs();

export const mockEvents: CalendarEvent[] = [
  {
    id: "evt_1",
    userId: "user_1",
    title: "Product Sync",
    description: "Weekly product planning with design and engineering.",
    date: now.add(1, "day").format("YYYY-MM-DD"),
    time: "10:30",
    reminderEnabled: true,
    reminderMinutes: 15,
    provider: "google",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "evt_2",
    userId: "user_1",
    title: "Client Demo",
    description: "Demo reminder workflows to enterprise client.",
    date: now.add(2, "day").format("YYYY-MM-DD"),
    time: "15:00",
    reminderEnabled: true,
    reminderMinutes: 30,
    provider: "outlook",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "evt_3",
    userId: "user_2",
    title: "Ops Review",
    description: "SLA and incident timeline review.",
    date: now.add(1, "day").format("YYYY-MM-DD"),
    time: "13:30",
    reminderEnabled: false,
    reminderMinutes: 10,
    provider: "google",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
];
