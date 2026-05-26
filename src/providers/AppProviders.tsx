"use client";

import { PropsWithChildren, useEffect, useRef } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { fetchGoogleUserProfile, requestGoogleAccessToken } from "@/services/calendar/googleOAuthService";
import { setupMockServer } from "@/services/api/mockServer";
import { useAuthStore } from "@/store/authStore";
import { useIntegrationStore } from "@/store/integrationStore";

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
  const silentAttemptedEmailRef = useRef<string | null>(null);
  const { user, isHydrated } = useAuthStore();
  const { providers, connectProviderWithAccount, syncAuthSession } = useIntegrationStore();

  useEffect(() => {
    if (!hasMockSetup) {
      setupMockServer();
      hasMockSetup = true;
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    syncAuthSession(user ? { id: user.id, email: user.email } : null);

    if (!user) {
      silentAttemptedEmailRef.current = null;
    }
  }, [isHydrated, syncAuthSession, user]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!isHydrated || !user || !clientId) {
      return;
    }

    const googleState = providers.google;
    const isUserBoundGoogleSession =
      googleState.connected &&
      googleState.appUserId === user.id &&
      googleState.appUserEmail?.toLowerCase() === user.email.toLowerCase() &&
      Boolean(googleState.accessToken);

    if (isUserBoundGoogleSession || silentAttemptedEmailRef.current === user.email) {
      return;
    }

    silentAttemptedEmailRef.current = user.email;

    let cancelled = false;

    requestGoogleAccessToken({
      clientId,
      email: user.email,
      prompt: "none",
    })
      .then(async (response) => {
        if (cancelled || response.error || !response.access_token) {
          return;
        }

        const profile = await fetchGoogleUserProfile(response.access_token);
        if (!profile.email || profile.email.toLowerCase() !== user.email.toLowerCase()) {
          return;
        }

        connectProviderWithAccount("google", profile.sub || `google_${user.id}`, {
          appUserId: user.id,
          appUserEmail: user.email,
          authMode: "oauth",
          accountEmail: profile.email,
          accessToken: response.access_token,
          tokenPreview: `${response.access_token.slice(0, 8)}...`,
        });
      })
      .catch(() => {
        return;
      });

    return () => {
      cancelled = true;
    };
  }, [connectProviderWithAccount, isHydrated, providers.google, user]);

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
