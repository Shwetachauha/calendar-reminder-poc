"use client";

import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useReminderEngine } from "@/hooks/useReminderEngine";

export default function DashboardLayout({ children }: PropsWithChildren) {
  useReminderEngine();

  return (
    <ProtectedRoute>
      <Box className="min-h-screen bg-[radial-gradient(circle_at_top,#d5f4f8_0%,#f2f7fb_30%,#f6f9fc_100%)]">
        <Navbar />
        <div className="mx-auto flex w-full max-w-[1440px] flex-col md:flex-row">
          <Sidebar />
          <main className="w-full p-4 md:p-6">{children}</main>
        </div>
      </Box>
    </ProtectedRoute>
  );
}
