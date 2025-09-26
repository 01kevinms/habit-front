
import type { NewHabit, Habit, ToggleResponse } from "../hooks/useHabits";
const API_URL = import.meta.env?.VITE_API_URL as string;

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
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
export async function getHabits(token?: string): Promise<Habit[]> {
  const raw = await apiFetch<any[]>("/api/habit", { method: "GET" }, token);
  return raw.map((h) => ({
    ...h,
    todayStatus: Boolean(h.todayStatus),
  }));
}

export async function createHabitApi(habit: NewHabit, token?: string) {
  return apiFetch<Habit>(
    "/api/habit",
    {
      method: "POST",
      body: JSON.stringify(habit),
    },
    token
  );
}

export async function deleteHabitApi(id: string, token?: string) {
  return apiFetch<void>(`/api/habit/${id}`, { method: "DELETE" }, token);
}

export async function toggleHabitLog(
  id: string,
  token?: string
): Promise<ToggleResponse> {
  return apiFetch<ToggleResponse>(
    `/api/habit/${id}/logs/toggle`,
    { method: "POST" },
    token
  );
}

// ---------------- STATS ----------------
export async function getDailyStats(token: string) {
  return apiFetch<{
    completedToday: number;
    totalHabits: number;
    percent: number;
  }>("/api/stat/daily", { method: "GET" }, token);
}

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
