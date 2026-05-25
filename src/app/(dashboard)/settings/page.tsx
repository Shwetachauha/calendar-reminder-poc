"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import { toast } from "sonner";
import { fetchGoogleUserProfile, loadGoogleIdentityScript } from "@/services/calendar/googleOAuthService";
import { useIntegrationStore } from "@/store/integrationStore";
import { CalendarProvider } from "@/types/event";

const providerLabels: Record<CalendarProvider, string> = {
  google: "Google Calendar",
  outlook: "Outlook Calendar",
};

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "-";
  }

  return dayjs(value).format("MMM DD, YYYY hh:mm A");
};

export default function SettingsPage() {
  const { providers, logs, connectProvider, connectProviderWithAccount, disconnectProvider } = useIntegrationStore();
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    loadGoogleIdentityScript()
      .then(() => setGoogleReady(true))
      .catch(() => {
        setGoogleReady(false);
      });
  }, []);

  const handleConnect = (provider: CalendarProvider) => {
    if (provider !== "google") {
      const accountId = connectProvider(provider);
      toast.success(`${providerLabels[provider]} connected (${accountId})`);
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in env");
      return;
    }

    if (!googleReady || !window.google?.accounts?.oauth2) {
      toast.error("Google OAuth script is not ready. Refresh and try again.");
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
      callback: async (response) => {
        if (response.error || !response.access_token) {
          toast.error("Google OAuth was cancelled or failed");
          return;
        }

        try {
          const profile = await fetchGoogleUserProfile(response.access_token);
          const accountId = profile.sub || `google_${Math.random().toString(36).slice(2, 8)}`;
          connectProviderWithAccount("google", accountId, {
            authMode: "oauth",
            accountEmail: profile.email,
            accessToken: response.access_token,
            tokenPreview: `${response.access_token.slice(0, 8)}...`,
          });
          toast.success(`Google connected as ${profile.email ?? accountId}`);
        } catch {
          toast.error("Google token received, but profile fetch failed");
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: "select_account" });
  };

  const handleDisconnect = (provider: CalendarProvider) => {
    disconnectProvider(provider);
    toast.success(`${providerLabels[provider]} disconnected`);
  };

  return (
    <Paper className="mx-auto max-w-4xl rounded-3xl border border-slate-100 bg-white/80 p-6 backdrop-blur">
      <Typography variant="h4" className="!font-black !text-slate-900">
        Settings
      </Typography>
      <Typography variant="body2" className="!mt-2 !text-slate-600">
        Frontend-only toggles for reminder behavior and notifications.
      </Typography>

      <Divider className="!my-5" />

      <Stack spacing={2}>
        <FormControlLabel control={<Switch defaultChecked />} label="Enable browser notifications" />
        <FormControlLabel control={<Switch defaultChecked />} label="Enable reminder polling" />
        <FormControlLabel control={<Switch />} label="Mute reminder sounds" />
      </Stack>

      <Divider className="!my-6" />

      <Typography variant="h6" className="!font-extrabold !text-slate-900">
        Calendar Integrations
      </Typography>
      <Typography variant="body2" className="!mt-1 !text-slate-600">
        Google uses real OAuth account chooser and token pickup. Outlook remains simulated in this POC.
      </Typography>

      <Stack spacing={2} className="!mt-4">
        {(Object.keys(providerLabels) as CalendarProvider[]).map((provider) => {
          const state = providers[provider];
          const needsGoogleReconnect =
            provider === "google" && (state.authMode !== "oauth" || !state.accessToken);

          return (
            <Paper
              key={provider}
              variant="outlined"
              className="rounded-2xl border-slate-200 bg-white/70 p-4"
            >
              <Box className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
                <Box>
                  <Typography variant="subtitle1" className="!font-bold !text-slate-900">
                    {providerLabels[provider]}
                  </Typography>
                  <Box className="mt-1 flex flex-wrap gap-2">
                    <Chip
                      size="small"
                      color={state.connected ? "success" : "default"}
                      label={state.connected ? "Connected" : "Disconnected"}
                    />
                    <Chip
                      size="small"
                      color={state.lastSyncStatus === "error" ? "error" : "info"}
                      icon={<SyncRoundedIcon />}
                      label={`Last sync: ${state.lastSyncStatus}`}
                    />
                  </Box>
                  <Typography variant="caption" className="!mt-2 !block !text-slate-600">
                    Account ID: {state.accountId ?? "-"}
                  </Typography>
                  <Typography variant="caption" className="!block !text-slate-600">
                    Auth mode: {state.authMode}
                  </Typography>
                  <Typography variant="caption" className="!block !text-slate-600">
                    Account email: {state.accountEmail ?? "-"}
                  </Typography>
                  <Typography variant="caption" className="!block !text-slate-600">
                    Access token: {state.accessToken ? "stored" : "-"}
                  </Typography>
                  <Typography variant="caption" className="!block !text-slate-600">
                    Token preview: {state.tokenPreview ?? "-"}
                  </Typography>
                  <Typography variant="caption" className="!block !text-slate-600">
                    Connected at: {formatDateTime(state.connectedAt)}
                  </Typography>
                  <Typography variant="caption" className="!block !text-slate-600">
                    Last synced at: {formatDateTime(state.lastSyncedAt)}
                  </Typography>
                  {needsGoogleReconnect ? (
                    <Typography variant="caption" className="!mt-1 !block !text-amber-700">
                      Google OAuth token missing. Reconnect to enable real calendar sync.
                    </Typography>
                  ) : null}
                  {state.lastError ? (
                    <Typography variant="caption" className="!mt-1 !block !text-rose-600">
                      Last error: {state.lastError}
                    </Typography>
                  ) : null}
                </Box>

                {state.connected ? (
                  <Box className="flex items-center gap-2">
                    {needsGoogleReconnect ? (
                      <Button
                        variant="contained"
                        startIcon={<LinkRoundedIcon />}
                        disabled={!googleReady}
                        onClick={() => handleConnect(provider)}
                      >
                        Reconnect Google OAuth
                      </Button>
                    ) : null}

                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<LinkOffRoundedIcon />}
                      onClick={() => handleDisconnect(provider)}
                    >
                      Disconnect
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<LinkRoundedIcon />}
                    disabled={provider === "google" && !googleReady}
                    onClick={() => handleConnect(provider)}
                  >
                    {provider === "google" ? "Connect with Google OAuth" : "Connect Dummy Account"}
                  </Button>
                )}
              </Box>
            </Paper>
          );
        })}
      </Stack>

      <Divider className="!my-6" />

      <Typography variant="h6" className="!font-extrabold !text-slate-900">
        Provider Sync Logs
      </Typography>
      <Typography variant="body2" className="!mt-1 !text-slate-600">
        Latest simulated integration events across Google and Outlook.
      </Typography>

      <Stack spacing={1.25} className="!mt-4">
        {logs.length ? (
          logs.map((log) => (
            <Paper
              key={log.id}
              variant="outlined"
              className="rounded-xl border-slate-200 bg-slate-50/70 px-3 py-2"
            >
              <Box className="flex flex-col justify-between gap-1 sm:flex-row">
                <Typography variant="body2" className="!font-semibold !text-slate-800">
                  [{providerLabels[log.provider]}] {log.message}
                </Typography>
                <Chip
                  size="small"
                  color={log.status === "success" ? "success" : "error"}
                  label={log.status.toUpperCase()}
                />
              </Box>

              <Typography variant="caption" className="!mt-1 !block !text-slate-600">
                {dayjs(log.timestamp).format("MMM DD, YYYY hh:mm:ss A")}
                {log.eventId ? ` | Event: ${log.eventId}` : ""}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body2" className="!text-slate-500">
            No sync activity yet. Connect a provider and create an event to see logs.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
