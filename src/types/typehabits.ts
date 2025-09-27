// types/typehabits.ts

/** Representa um log de um hábito em um dia específico */
export interface HabitLog {
  id: string;
  dayKey: string; // formato "2025-09-24"
  status: boolean;
}

/** Representa um hábito criado pelo usuário */
export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  logs: HabitLog[];        // nunca undefined, backend sempre envia array (mesmo vazio)
  todayStatus: boolean;    // sempre boolean, calculado no backend
}

/** Tipo para criação de hábito (sem id, logs e todayStatus) */
export type NewHabit = Omit<Habit, "id" | "logs" | "todayStatus">;

/** Resposta do toggle (quando usuário marca/desmarca hábito) */
export interface ToggleResponse {
  habit: Habit;
  stats: {
    completedToday: number;
    totalHabits: number;
    percent: number;
  };
}
