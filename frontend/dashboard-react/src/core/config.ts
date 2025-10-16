// src/core/config.ts

const env = import.meta.env;

function assertEnv<K extends keyof ImportMetaEnv>(name: K, value?: string) {
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(`[Config] Falta ${name} en tu .env`);
  }
}

assertEnv("VITE_API_BASE_URL", env.VITE_API_BASE_URL);
assertEnv("VITE_TILES_URL", env.VITE_TILES_URL);

export const AppConfig = {
  apiBaseUrl: (env.VITE_API_BASE_URL || "").replace(/\/+$/, ""),
  tilesUrl:
    env.VITE_TILES_URL ||
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
} as const;

export const apiUrl = (path: string) =>
  `${AppConfig.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

export function authHeader(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function jsonHeaders(extra?: Record<string, string>): Record<string, string> {
  return { "Content-Type": "application/json", ...(extra || {}) };
}
