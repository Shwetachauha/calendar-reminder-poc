"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import clsx from "clsx";

const items = [
  { label: "Calendar", href: "/dashboard", icon: CalendarMonthRoundedIcon },
  { label: "Settings", href: "/settings", icon: SettingsRoundedIcon },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-slate-200 bg-white/50 p-4 md:w-64 md:p-6">
      <Typography variant="overline" className="!mb-4 !block !font-bold !text-cyan-700">
        Workspace
      </Typography>

      <Box className="space-y-2">
        {items.map((item) => {
          const ActiveIcon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
                active
                  ? "bg-cyan-700 text-white shadow-lg shadow-cyan-500/30"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <ActiveIcon fontSize="small" />
              {item.label}
            </Link>
          );
        })}
      </Box>
    </aside>
  );
};
