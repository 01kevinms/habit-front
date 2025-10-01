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
export interface User { // Interface para tipagem do usuário
  id: string; // ID do usuário
  name: string; // Nome do usuário
  email: string; // Email do usuário
}

export type Theme = "light" | "dark"; // Define os tipos possíveis de tema

export interface ThemeContextType { 
  theme: Theme; // Tema atual
  toggleTheme: () => void; // Função de alternar tema
}


// Definição da estrutura que o contexto de autenticação vai ter
export interface AuthContextType { 
  user: any | null; // Usuário autenticado ou null
  token: string | null; // Token JWT ou null
  login: (email: string, password: string) => Promise<void>; // Função login
  logout: () => void; // Função logout
  register: (name: string, email: string, password: string) => Promise<void>; // Função registro
}