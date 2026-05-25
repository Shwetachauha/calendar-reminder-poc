"use client";

import { PropsWithChildren, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { setupMockServer } from "@/services/api/mockServer";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#087f8c",
    },
    secondary: {
      main: "#ff5d73",
    },
    background: {
      default: "#f2f7fb",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
  },
});

let hasMockSetup = false;

export const AppProviders = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    if (!hasMockSetup) {
      setupMockServer();
      hasMockSetup = true;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
