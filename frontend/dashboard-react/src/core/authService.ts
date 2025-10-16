// src/core/authService.ts
import { apiUrl, authHeader, jsonHeaders } from "./config";

// Tipos de dominio
export type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

type AuthResponse = {
  user: User;
  token: string;
};

// Request helper tipado (genérico)
async function req<T>(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {}
): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      ...jsonHeaders(), // Content-Type: application/json
      ...(init.headers || {}),
    },
  });

  // Si no hay body, evita romper el json()
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : ({} as unknown);

  if (!res.ok) {
    const msg =
      (typeof data === "object" && data && (data as any).message) ||
      `Error ${res.status}`;
    throw new Error(String(msg));
  }

  return data as T;
}

export const authService = {
  async register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const data = await req<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("token", data.token);
    return data.user;
  },

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const data = await req<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", data.token);
    return data.user;
  },

  async me(): Promise<User | null> {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const me = await req<User>("/auth/me", {
      headers: { ...authHeader(token) },
    });
    return me;
  },

  logout(): void {
    localStorage.removeItem("token");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },
};
