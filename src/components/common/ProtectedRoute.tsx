"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuthStore } from "@/store/authStore";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isHydrated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !isHydrated) {
      return;
    }

    if (!user && pathname !== "/login") {
      router.replace("/login");
    }

    if (user && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isClient, isHydrated, pathname, router, user]);

  if (!isClient) {
    return null;
  }

  if (!isHydrated || (!user && pathname !== "/login")) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return <>{children}</>;
};
