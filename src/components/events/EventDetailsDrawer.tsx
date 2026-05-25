"use client";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { CalendarEvent } from "@/types/event";
import { formatEventDate, formatEventTime } from "@/utils/time";
import { ReminderBadge } from "@/components/events/ReminderBadge";

interface EventDetailsDrawerProps {
  open: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
}

export const EventDetailsDrawer = ({ open, event, onClose }: EventDetailsDrawerProps) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box className="h-full w-[320px] space-y-4 bg-white p-5 sm:w-[420px]">
        <Typography variant="overline" className="!font-bold !text-cyan-700">
          Event Details
        </Typography>

        <Typography variant="h5" className="!font-bold !text-slate-900">
          {event?.title ?? "-"}
        </Typography>

        <Typography variant="body1" className="!text-slate-600">
          {event?.description ?? "No description"}
        </Typography>

        <Stack direction="row" spacing={1} className="flex-wrap gap-2">
          <Chip label={event ? formatEventDate(event.date) : "-"} variant="outlined" />
          <Chip label={event ? formatEventTime(event.time) : "-"} variant="outlined" />
          <Chip
            color={event?.provider === "google" ? "primary" : "secondary"}
            label={event?.provider === "google" ? "Google" : "Outlook"}
          />
        </Stack>

        {event ? <ReminderBadge enabled={event.reminderEnabled} minutes={event.reminderMinutes} /> : null}
      </Box>
    </Drawer>
  );
};
