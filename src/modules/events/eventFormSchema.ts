import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  reminderEnabled: z.boolean(),
  reminderMinutes: z.number().min(5),
  provider: z.enum(["google", "outlook"]),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
