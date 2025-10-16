import { apiUrl, authHeader, jsonHeaders } from "./config";

export type Plot = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  areaHa: number;
  status: "active" | "deleted";
  cropId?: number | null;
  responsibleId?: number | null;
  crop?: { id: number; name: string } | null;
  responsible?: { id: number; name: string; email: string } | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type PlotInput = {
  name: string;
  lat: number;
  lng: number;
  areaHa?: number;
  cropId?: number | null;
  responsibleId?: number | null;
};

async function req<T>(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {}
): Promise<T> {
  const token = localStorage.getItem("token") || undefined;
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      ...jsonHeaders(),
      ...authHeader(token),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data: any = {};
  if (text) {
    try { data = JSON.parse(text); } catch { /* respuesta no JSON */ }
  }
  if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
  return data as T;
}

export const plotsService = {
  list(status?: "active" | "deleted"): Promise<Plot[]> {
    const qs = status ? `?status=${status}` : "";
    return req<Plot[]>(`/plots${qs}`);
  },
  listDeleted(): Promise<Plot[]> {
    return req<Plot[]>(`/plots/deleted`);
  },
  get(id: number): Promise<Plot> {
    return req<Plot>(`/plots/${id}`);
  },
  create(input: PlotInput): Promise<Plot> {
    return req<Plot>("/plots", { method: "POST", body: JSON.stringify(input) });
  },
  update(id: number, input: Partial<PlotInput> & { status?: "active" | "deleted" }): Promise<Plot> {
    return req<Plot>(`/plots/${id}`, { method: "PUT", body: JSON.stringify(input) });
  },
  softDelete(id: number): Promise<Plot> {
    return req<Plot>(`/plots/${id}`, { method: "DELETE" });
  },
  restore(id: number): Promise<Plot> {
    return req<Plot>(`/plots/${id}/restore`, { method: "PATCH" });
  },
  hardDelete(id: number): Promise<void> {
    return req<void>(`/plots/${id}/hard`, { method: "DELETE" });
  },
};
