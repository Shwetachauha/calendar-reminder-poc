"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { REMINDER_POLLING_INTERVAL_MS } from "@/constants/app";
import { useEventStore } from "@/store/eventStore";
import { getReminderDateTime } from "@/utils/time";
import { pushBrowserNotification, requestNotificationPermission } from "@/utils/notification";

export const useReminderEngine = () => {
  const { events, markReminderNotified } = useEventStore();

  useEffect(() => {
    void requestNotificationPermission();

    const id = window.setInterval(() => {
      const now = dayjs();
      events.forEach((event) => {
        if (!event.reminderEnabled || event.reminderNotified) {
          return;
        }

        const reminderAt = getReminderDateTime(event);
        const isDue = now.isAfter(reminderAt) || now.isSame(reminderAt);

        if (isDue) {
          const message = `${event.title} starts at ${event.time}`;
          toast.info(`Reminder: ${message}`);
          pushBrowserNotification("Event Reminder", message);
          markReminderNotified(event.id);
        }
      });
    }, REMINDER_POLLING_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [events, markReminderNotified]);
};
