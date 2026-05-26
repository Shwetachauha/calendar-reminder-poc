"use client";

import dayjs from "dayjs";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage";
import { CalendarProvider } from "@/types/event";
import { IntegrationAppUser, ProviderIntegration, ProviderSyncLog } from "@/types/integration";

interface IntegrationState {
  providers: Record<CalendarProvider, ProviderIntegration>;
  logs: ProviderSyncLog[];
  connectProvider: (provider: CalendarProvider, user?: IntegrationAppUser | null) => string;
  connectProviderWithAccount: (
    provider: CalendarProvider,
    accountId: string,
    options?: {
      appUserId?: string;
      appUserEmail?: string;
      accountEmail?: string;
      accessToken?: string;
      tokenPreview?: string;
      authMode?: "dummy" | "oauth";
    },
  ) => void;
  disconnectProvider: (provider: CalendarProvider) => void;
  isProviderConnected: (provider: CalendarProvider) => boolean;
  syncAuthSession: (user: IntegrationAppUser | null) => void;
  markSyncSuccess: (provider: CalendarProvider, eventId: string) => void;
  markSyncError: (provider: CalendarProvider, message: string, eventId?: string) => void;
}

const MAX_SYNC_LOGS = 20;

const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `id_${Math.random().toString(36).slice(2, 10)}`;
};

const defaultProviderState = (provider: CalendarProvider): ProviderIntegration => ({
  provider,
  connected: false,
  authMode: "dummy",
  appUserId: null,
  appUserEmail: null,
  accountId: null,
  accountEmail: null,
  accessToken: null,
  tokenPreview: null,
  connectedAt: null,
  lastSyncedAt: null,
  lastSyncedEventId: null,
  lastSyncStatus: "idle",
  lastError: null,
});

const appendLog = (existing: ProviderSyncLog[], log: ProviderSyncLog) => {
  return [log, ...existing].slice(0, MAX_SYNC_LOGS);
};

const defaultProviders = (): Record<CalendarProvider, ProviderIntegration> => ({
  google: defaultProviderState("google"),
  outlook: defaultProviderState("outlook"),
});

const hasStaleSession = (
  providers: Record<CalendarProvider, ProviderIntegration>,
  user: IntegrationAppUser | null,
) => {
  return (Object.values(providers) as ProviderIntegration[]).some((provider) => {
    if (!provider.connected) {
      return false;
    }

    if (!user) {
      return true;
    }

    if (!provider.appUserId || !provider.appUserEmail) {
      return true;
    }

    return provider.appUserId !== user.id || provider.appUserEmail.toLowerCase() !== user.email.toLowerCase();
  });
};

export const useIntegrationStore = create<IntegrationState>()(
  persist(
    (set, get) => ({
      providers: {
        ...defaultProviders(),
      },
      logs: [],
      connectProvider: (provider, user) => {
        const accountId = `${provider}_acct_${Math.random().toString(36).slice(2, 8)}`;
        get().connectProviderWithAccount(provider, accountId, {
          authMode: "dummy",
          appUserId: user?.id,
          appUserEmail: user?.email,
        });

        return accountId;
      },
      connectProviderWithAccount: (provider, accountId, options) => {
        const now = dayjs().toISOString();
        const authMode = options?.authMode ?? "oauth";
        const appUserId = options?.appUserId ?? null;
        const appUserEmail = options?.appUserEmail ?? null;
        const accountEmail = options?.accountEmail ?? null;
        const accessToken = options?.accessToken ?? null;
        const tokenPreview = options?.tokenPreview ?? null;

        set((state) => ({
          providers: {
            ...state.providers,
            [provider]: {
              ...state.providers[provider],
              connected: true,
              authMode,
              appUserId,
              appUserEmail,
              accountId,
              accountEmail,
              accessToken,
              tokenPreview,
              connectedAt: now,
              lastSyncStatus: "idle",
              lastError: null,
            },
          },
          logs: appendLog(state.logs, {
            id: makeId(),
            provider,
            status: "success",
            message:
              authMode === "oauth"
                ? `OAuth connected for ${appUserEmail ?? accountEmail ?? accountId}`
                : `Dummy account connected: ${accountId}`,
            timestamp: now,
          }),
        }));
      },
      disconnectProvider: (provider) => {
        const now = dayjs().toISOString();

        set((state) => ({
          providers: {
            ...state.providers,
            [provider]: defaultProviderState(provider),
          },
          logs: appendLog(state.logs, {
            id: makeId(),
            provider,
            status: "success",
            message: "Provider disconnected",
            timestamp: now,
          }),
        }));
      },
      isProviderConnected: (provider) => get().providers[provider].connected,
      syncAuthSession: (user) => {
        set((state) => {
          if (!hasStaleSession(state.providers, user)) {
            return state;
          }

          return {
            providers: defaultProviders(),
            logs: [],
          };
        });
      },
      markSyncSuccess: (provider, eventId) => {
        const now = dayjs().toISOString();

        set((state) => ({
          providers: {
            ...state.providers,
            [provider]: {
              ...state.providers[provider],
              lastSyncedAt: now,
              lastSyncedEventId: eventId,
              lastSyncStatus: "success",
              lastError: null,
            },
          },
          logs: appendLog(state.logs, {
            id: makeId(),
            provider,
            status: "success",
            message: "Sync completed",
            eventId,
            timestamp: now,
          }),
        }));
      },
      markSyncError: (provider, message, eventId) => {
        const now = dayjs().toISOString();

        set((state) => ({
          providers: {
            ...state.providers,
            [provider]: {
              ...state.providers[provider],
              lastSyncStatus: "error",
              lastError: message,
            },
          },
          logs: appendLog(state.logs, {
            id: makeId(),
            provider,
            status: "error",
            message,
            eventId,
            timestamp: now,
          }),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.integrations,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
