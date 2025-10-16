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

export type DietType= "bulking" | "cutting"
export type GenereType= "masculine" | "feminine"
export type Food={
  id: string
  description: string
  calories: number
  grams: number
  protein: number
  carbs: number;
  originalGrams?: number;
  originalCalories?: number;
  originalProtein?: number;
  originalCarbs?: number;
}
export type NewFoodForBackend = {
  description: string;
  grams: number;
}

// usado na criação de um novo alimento no frontend
export type NewFood = Omit<Food, "id">;
export interface Diet {
  id: string;
  type: DietType;
  description: string;
  period: "Manhã" | "meio-dia" | "noite";
  createdAt: string;
  foods: Food[]
  userId: string;
  calories: number;
  grams: number;
  datekey: string;
}

export interface NewDiet {
  id?: string
  type: DietType;
  description?: string;
  period: "Manhã" | "meio-dia" | "noite";
  calories?: number;
  grams?: number;
  foods?: NewFood[]
  datekey: string;
}


export interface DietResponse {
  diets: Diet[];
  atingiumeta: boolean;
  totalCalories: number;
  meta: number;
}
export interface DietProgressRequest {
  goal: number;
  date?: string;
}

export interface DietProgress {
  id?: string;
  userId?: string;
  date?: string;
  calories?: number;
  goal?: number;
  achieved?: boolean;
}
export interface Status {
  id: string;
  weight: number;
  height: number;
  imc: number;
  age: number;
  genere: GenereType;
  tmb: number;
}

export interface NewStatus {
  weight: number;
  height: number;
  imc: number;
  age: number;
  genere: GenereType;
  tmb: number;
}
export interface NutritionixFood {
  food_name: string;
  serving_qty: number;
  serving_unit: string;
  nf_calories: number;
  nf_total_fat: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  photo: { thumb: string; highres: string };
}
export interface DietLayoutProps {
  dietsList: Diet[];
  dietToEdit?: Diet | null;
}

export interface ListDietsProps {
  diets: Diet[];
  onEdit: (diet: Diet) => void;
  onDelete: (id: string)=>void
  food?: Food
  onUpdate?: (foodId: string, grams: number) => void
}
