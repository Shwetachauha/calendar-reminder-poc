"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { CalendarEvent } from "@/types/event";
import { ReminderBadge } from "@/components/events/ReminderBadge";
import { formatEventDate, formatEventTime } from "@/utils/time";

interface EventCardProps {
  event: CalendarEvent;
  onView: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export const EventCard = ({ event, onView, onDelete }: EventCardProps) => {
  return (
    <Card className="rounded-2xl border border-slate-100 bg-white/80 shadow-sm backdrop-blur">
      <CardContent className="space-y-4 p-5">
        <Stack direction="row" className="items-start justify-between">
          <div>
            <Typography variant="h6" className="!font-bold !text-slate-900">
              {event.title}
            </Typography>
            <Typography variant="body2" className="!mt-1 !text-slate-600">
              {event.description}
            </Typography>
          </div>
          <Chip
            size="small"
            label={event.provider === "google" ? "Google" : "Outlook"}
            color={event.provider === "google" ? "primary" : "secondary"}
          />
        </Stack>

        <Stack direction="row" spacing={1} className="flex-wrap gap-2">
          <Chip label={formatEventDate(event.date)} variant="outlined" size="small" />
          <Chip label={formatEventTime(event.time)} variant="outlined" size="small" />
          <ReminderBadge enabled={event.reminderEnabled} minutes={event.reminderMinutes} />
        </Stack>

        <Stack direction="row" className="justify-end gap-1">
          <IconButton color="primary" onClick={() => onView(event)}>
            <VisibilityRoundedIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(event.id)}>
            <DeleteOutlineRoundedIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};
