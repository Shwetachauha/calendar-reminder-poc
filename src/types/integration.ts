import { CalendarProvider } from "@/types/event";

export type IntegrationSyncStatus = "idle" | "success" | "error";

export interface ProviderIntegration {
  provider: CalendarProvider;
  connected: boolean;
  authMode: "dummy" | "oauth";
  accountId: string | null;
  accountEmail: string | null;
  tokenPreview: string | null;
  connectedAt: string | null;
  lastSyncedAt: string | null;
  lastSyncedEventId: string | null;
  lastSyncStatus: IntegrationSyncStatus;
  lastError: string | null;
}

export interface ProviderSyncLog {
  id: string;
  provider: CalendarProvider;
  status: Exclude<IntegrationSyncStatus, "idle">;
  message: string;
  eventId?: string;
  timestamp: string;
}
