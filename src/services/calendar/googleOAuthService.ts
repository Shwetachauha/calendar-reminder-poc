const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client";
const GOOGLE_CALENDAR_SCOPE = "openid email profile https://www.googleapis.com/auth/calendar.events";

export const loadGoogleIdentityScript = async () => {
  if (typeof window === "undefined") {
    return;
  }

  if (window.google?.accounts?.oauth2) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src=\"${GOOGLE_IDENTITY_SCRIPT}\"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Identity script")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity script"));
    document.head.appendChild(script);
  });
};

export const fetchGoogleUserProfile = async (accessToken: string) => {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch Google profile");
  }

  return (await response.json()) as {
    sub: string;
    email?: string;
    name?: string;
  };
};

export const requestGoogleAccessToken = async (options: {
  clientId: string;
  email: string;
  prompt?: "" | "consent" | "select_account" | "none";
}) => {
  await loadGoogleIdentityScript();

  const googleOAuth = window.google?.accounts?.oauth2;
  if (!googleOAuth) {
    throw new Error("Google OAuth script is not ready");
  }

  // Always resolve — never reject — so callers can inspect the error field
  // and decide whether to fall back to interactive flow.
  return new Promise<{ access_token?: string; error?: string }>((resolve) => {
    const tokenClient = googleOAuth.initTokenClient({
      client_id: options.clientId,
      scope: GOOGLE_CALENDAR_SCOPE,
      hint: options.email,
      callback: (response) => resolve(response),
      error_callback: () => resolve({ error: "silent_failed" }),
    });

    tokenClient.requestAccessToken({
      prompt: options.prompt ?? "",
      hint: options.email,
    });
  });
};
