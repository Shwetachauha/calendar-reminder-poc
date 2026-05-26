"use client";

import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { LoadingButton } from "@mui/lab";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { REMINDER_OPTIONS } from "@/constants/app";
import { EventFormValues, eventFormSchema } from "@/modules/events/eventFormSchema";

interface EventFormModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: EventFormValues) => Promise<void>;
  syncTargetLabel: string;
}

const defaultValues: EventFormValues = {
  title: "",
  description: "",
  date: "",
  time: "09:00",
  reminderEnabled: true,
  reminderMinutes: 15,
};

export const EventFormModal = ({ open, loading, onClose, onSubmit, syncTargetLabel }: EventFormModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    defaultValues,
    resolver: zodResolver(eventFormSchema),
  });

  const reminderEnabled = useWatch({ control, name: "reminderEnabled" });

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Create Calendar Event</DialogTitle>

      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2} className="pt-2">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Event Title"
                  fullWidth
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  minRows={3}
                  fullWidth
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(value) => field.onChange(value ? value.format("YYYY-MM-DD") : "")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.date),
                        helperText: errors.date?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Time"
                    value={field.value ? dayjs(`2024-01-01 ${field.value}`) : null}
                    onChange={(value) => field.onChange(value ? value.format("HH:mm") : "")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.time),
                        helperText: errors.time?.message,
                      },
                    }}
                  />
                )}
              />
            </Stack>

            <Alert severity="info">New events will sync automatically to {syncTargetLabel}.</Alert>

            <Controller
              name="reminderEnabled"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />}
                  label="Enable reminder"
                />
              )}
            />

            {reminderEnabled ? (
              <Controller
                name="reminderMinutes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Reminder minutes"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {REMINDER_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option} minutes before
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            ) : null}
          </Stack>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={loading} variant="contained" onClick={handleSubmit(onSubmit)}>
          Save Event
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
