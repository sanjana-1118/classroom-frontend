import type { AuthProvider } from "@refinedev/core";

import { BACKEND_BASE_URL } from "@/constants";
import type { User } from "@/types";

type AuthResponse = {
  user?: User;
  session?: unknown;
  error?: {
    message?: string;
  };
};

const getBaseUrl = () => {
  if (typeof window !== "undefined" && window.location.hostname.endsWith(".vercel.app")) {
    return "/api";
  }
  return BACKEND_BASE_URL.replace(/\/$/, "");
};

const authUrl = (path: string) => `${getBaseUrl()}/auth/${path}`;

const request = async (path: string, body?: Record<string, unknown>) => {
  const response = await fetch(authUrl(path), {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await response.json().catch(() => ({}))) as AuthResponse;

  if (!response.ok) {
    const errorMsg = (payload as any).message || payload.error?.message || "Authentication request failed";
    throw new Error(errorMsg);
  }

  return payload;
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    await request("sign-in/email", { email, password });
    return { success: true, redirectTo: "/dashboard" };
  },

  register: async ({ email, password, name, role }) => {
    const selectedRole = role === "teacher" ? "teacher" : "student";

    await request("sign-up/email", {
      email,
      password,
      name: name || email,
      role: selectedRole,
    });
    return { success: true, redirectTo: "/dashboard" };
  },

  logout: async () => {
    await request("sign-out", {});
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    try {
      const payload = await request("get-session");
      if (!payload) {
        throw new Error("No session");
      }
      return { authenticated: true };
    } catch {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }
  },

  getIdentity: async () => {
    const payload = await request("get-session");
    return payload.user ?? null;
  },

  onError: async (error) => {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      return { logout: true, redirectTo: "/login" };
    }

    return {};
  },
};