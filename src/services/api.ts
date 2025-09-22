// ./services/api.ts
import type { NewHabit, Habit } from "../hooks/useHabits";

const API_URL = (import.meta.env?.VITE_API_URL as string) ?? "http://localhost:3001";

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // não é JSON
    data = text;
  }

  if (!res.ok) {
    let errorMessage = "Unknown error occurred";

    if (typeof data === "string") {
      errorMessage = data;
    } else if (data && typeof data === "object") {
      errorMessage = data.message || data.error || JSON.stringify(data);
    } else if (res.statusText) {
      errorMessage = res.statusText;
    }

    console.error("API Error:", errorMessage);
    throw new Error(errorMessage);
  }
  return data as T;
}

// ---------------- Helper para requisições autenticadas ----------------
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const authToken = token ?? localStorage.getItem("token") ?? undefined;

  const headers: Record<string, string> = {
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
if (authToken) {
  headers["Authorization"] = `Bearer ${authToken}`;
}

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Error: " + res.statusText);
  }
  return handleResponse<T>(res);
}

// ---------------- AUTH ----------------
export async function loginUser(email: string, password: string) {
  return apiFetch<{ token: string; user: any }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(name: string, email: string, password: string) {
  return apiFetch<{ token: string; user: any }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// ---------------- HABITS ----------------
export async function getHabits(token?: string) {
  return apiFetch<Habit[]>("/api/habit", { method: "GET" }, token);
}

export async function createHabit(habit: NewHabit, token?: string) {
  return apiFetch<Habit>(
    "/api/habit",
    {
      method: "POST",
      body: JSON.stringify(habit),
    },
    token
  );
}

export async function deleteHabit(id: string, token?: string) {
  return apiFetch<void>(`/api/habit/${id}`, { method: "DELETE" }, token);
}

export async function toggleHabitLog(id: string, token?: string) {
  return apiFetch<Habit>(`/api/habit/${id}/logs/toggle`, { method: "POST" }, token);
}

// === STATS ===
export async function getWeeklyStats(token?: string) {
  return apiFetch<{ day: string; percent: number }[]>(
    "/api/stat/weekly",
    { method: "GET" },
    token
  );
}

export async function getMonthlyStats(token?: string) {
  return apiFetch<{ week: string; percent: number }[]>(
    "/api/stat/monthly",
    { method: "GET" },
    token
  );
}

export async function getStreak(token?: string) {
  return apiFetch<{ maxStreak: number; currentStreak: number }>(
    "/api/stat/streak",
    { method: "GET" },
    token
  );
}
