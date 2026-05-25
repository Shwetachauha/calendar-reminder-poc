import MockAdapter from "axios-mock-adapter";
import dayjs from "dayjs";
import { axiosClient } from "@/services/api/axiosClient";
import { mockUsers } from "@/mock/users";
import { getStoredEvents, setStoredEvents } from "@/services/api/mockDb";
import { EventPayload } from "@/types/event";

const AUTH_HEADER = "authorization";
const DELAY_MS = 800;

const parse = <T>(value: string | object | null | undefined): T => {
  if (!value) {
    return {} as T;
  }

  if (typeof value === "string") {
    return JSON.parse(value) as T;
  }

  return value as T;
};

const requireAuth = (headers?: Record<string, unknown>) => {
  const token = (headers?.[AUTH_HEADER] ?? headers?.Authorization) as string | undefined;
  return token?.startsWith("Bearer mock_") ? token : null;
};

const withDelay = (response: [number, unknown]) =>
  new Promise<[number, unknown]>((resolve) => {
    setTimeout(() => resolve(response), DELAY_MS);
  });

export const setupMockServer = () => {
  const mock = new MockAdapter(axiosClient, { delayResponse: DELAY_MS });

  mock.onPost("/login").reply((config) => {
    const body = parse<{ email: string; password: string }>(config.data);
    const user = mockUsers.find(
      (item) => item.email.toLowerCase() === body.email?.toLowerCase() && item.password === body.password,
    );

    if (!user) {
      return [401, { message: "Invalid email or password" }];
    }

    return [
      200,
      {
        token: `mock_${user.id}_${Date.now()}`,
        userId: user.id,
        name: user.name,
        email: user.email,
      },
    ];
  });

  mock.onGet("/events").reply((config) => {
    if (!requireAuth(config.headers as Record<string, unknown>)) {
      return [401, { message: "Unauthorized" }];
    }

    const userId = (config.params?.userId as string | undefined) ?? "";
    const events = getStoredEvents().filter((item) => item.userId === userId);

    return [200, events];
  });

  mock.onPost("/events").reply((config) => {
    if (!requireAuth(config.headers as Record<string, unknown>)) {
      return [401, { message: "Unauthorized" }];
    }

    const payload = parse<EventPayload & { userId: string }>(config.data);
    const now = dayjs().toISOString();
    const events = getStoredEvents();
    const newEvent = {
      ...payload,
      id: `evt_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: now,
      updatedAt: now,
      reminderNotified: false,
    };

    setStoredEvents([newEvent, ...events]);

    return [201, newEvent];
  });

  mock.onPut(/\/events\/[^/]+$/).reply((config) => {
    if (!requireAuth(config.headers as Record<string, unknown>)) {
      return [401, { message: "Unauthorized" }];
    }

    const eventId = config.url?.split("/").pop();
    const payload = parse<Partial<EventPayload>>(config.data);
    const events = getStoredEvents();

    const target = events.find((item) => item.id === eventId);
    if (!target) {
      return [404, { message: "Event not found" }];
    }

    const updated = {
      ...target,
      ...payload,
      updatedAt: dayjs().toISOString(),
    };

    setStoredEvents(events.map((item) => (item.id === eventId ? updated : item)));

    return [200, updated];
  });

  mock.onDelete(/\/events\/[^/]+$/).reply((config) => {
    if (!requireAuth(config.headers as Record<string, unknown>)) {
      return [401, { message: "Unauthorized" }];
    }

    const eventId = config.url?.split("/").pop();
    const events = getStoredEvents();
    const exists = events.some((item) => item.id === eventId);

    if (!exists) {
      return [404, { message: "Event not found" }];
    }

    setStoredEvents(events.filter((item) => item.id !== eventId));

    return [200, { success: true }];
  });

  mock.onPost("/calendar-sync").reply(async (config) => {
    if (!requireAuth(config.headers as Record<string, unknown>)) {
      return [401, { message: "Unauthorized" }];
    }

    const payload = parse<{ provider: "google" | "outlook"; eventId: string }>(config.data);

    if (payload.eventId.endsWith("zzz")) {
      return withDelay([500, { message: `Failed to sync ${payload.provider} calendar` }]);
    }

    return withDelay([
      200,
      {
        success: true,
        provider: payload.provider,
        syncedAt: dayjs().toISOString(),
      },
    ]);
  });
};
