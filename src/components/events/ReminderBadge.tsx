import Chip from "@mui/material/Chip";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";

interface ReminderBadgeProps {
  enabled: boolean;
  minutes: number;
}

export const ReminderBadge = ({ enabled, minutes }: ReminderBadgeProps) => {
  return enabled ? (
    <Chip
      color="success"
      size="small"
      icon={<NotificationsActiveRoundedIcon />}
      label={`${minutes} min before`}
    />
  ) : (
    <Chip size="small" icon={<NotificationsOffRoundedIcon />} label="Reminder off" />
  );
};
