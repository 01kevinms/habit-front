import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHabits,
  createHabitApi,
  deleteHabitApi,
  toggleHabitLog,
} from "../services/api";
import { useAuth } from "../services/AuthContext";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  todayStatus?: boolean; // simplificado: true = feito, false = não feito
}

export type NewHabit = Omit<Habit, "id" | "todayStatus">;

export interface DailyStats {
  completedToday: number;
  totalHabits: number;
  percentage: number;
}

export interface ToggleResponse {
  habit: Habit;
  stats: DailyStats;
}

export function useHabits() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Helper: invalida todas as queries de stats
  const invalidateStats = () => {
    queryClient.invalidateQueries({ queryKey: ["dailyStats"] });
    queryClient.invalidateQueries({ queryKey: ["weeklyStats"] });
    queryClient.invalidateQueries({ queryKey: ["monthlyStats"] });
    queryClient.invalidateQueries({ queryKey: ["streak"] });
  };

  // Lista de hábitos
  const { data: habits = [], isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: () => getHabits(token!),
    enabled: !!token,
  });

  // Criar hábito
  const createHabit = useMutation({
    mutationFn: (habit: NewHabit) => createHabitApi(habit, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      invalidateStats();
    },
  });

  // Excluir hábito
  const deleteHabit = useMutation({
    mutationFn: (id: string) => deleteHabitApi(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      invalidateStats();
    },
  });

  // Alternar hábito do dia
  const toggle = useMutation({
    mutationFn: (id: string) => toggleHabitLog(id, token!),
    onSuccess: (updated) => {
      // Atualiza cache local de habits
      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old ? old.map((h) => (h.id === updated.habit.id ? updated.habit : h)) : []
      );

      // Atualiza cache local do dailyStats com a resposta da API
      queryClient.setQueryData(["dailyStats"], updated.stats);

      // Atualiza todos os outros stats
      invalidateStats();
    },
  });

  return {
    habits,
    isLoading,
    createHabit,
    deleteHabit,
    toggle,
  };
}
