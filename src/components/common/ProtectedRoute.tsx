"use client";

import { PropsWithChildren, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuthStore } from "@/store/authStore";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!user && pathname !== "/login") {
      router.replace("/login");
    }

    if (user && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isHydrated, pathname, router, user]);

  if (!isHydrated || (!user && pathname !== "/login")) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return <>{children}</>;
};
