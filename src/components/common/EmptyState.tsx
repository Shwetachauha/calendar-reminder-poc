import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";

export const EmptyState = () => {
  return (
    <Box className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center">
      <EventBusyRoundedIcon className="!mb-3 !text-5xl !text-slate-300" />
      <Typography variant="h6" className="!font-bold !text-slate-700">
        No events found
      </Typography>
      <Typography variant="body2" className="!mt-1 !text-slate-500">
        Add your first reminder and keep your schedule in control.
      </Typography>
    </Box>
  );
};
