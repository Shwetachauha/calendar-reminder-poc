"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Box from "@mui/material/Box";
import { APP_NAME } from "@/constants/app";
import { useAuthStore } from "@/store/authStore";

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="border-b border-slate-100 bg-white/70 backdrop-blur-xl"
    >
      <Toolbar className="flex items-center justify-between">
        <Typography variant="h6" className="!font-bold !text-slate-900">
          {APP_NAME}
        </Typography>

        <Box className="flex items-center gap-3">
          <Avatar className="!bg-cyan-700">{user?.name?.charAt(0) ?? "U"}</Avatar>
          <Typography variant="body2" className="hidden text-slate-600 sm:block">
            {user?.name}
          </Typography>
          <IconButton color="error" onClick={logout}>
            <LogoutRoundedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
