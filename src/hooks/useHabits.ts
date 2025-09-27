import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHabits,
  createHabitApi,
  deleteHabitApi,
  toggleHabitLog,
} from "../services/api";
import { useAuth } from "../services/AuthContext";
import type { Habit, NewHabit, ToggleResponse } from "../types/typehabits";

export function useHabits() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Busca hábitos (usa todayStatus direto do backend)
  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: () => getHabits(token!),
    enabled: !!token,
    staleTime: 1000 * 30, // 30s
    cacheTime: 1000 * 60 * 5, // 5min
  });

  const invalidateStats = () => {
    queryClient.invalidateQueries({ queryKey: ["dailyStats"] });
    queryClient.invalidateQueries({ queryKey: ["weeklyStats"] });
    queryClient.invalidateQueries({ queryKey: ["monthlyStats"] });
    queryClient.invalidateQueries({ queryKey: ["streak"] });
  };

  const createHabit = useMutation({
    mutationFn: (habit: NewHabit) => createHabitApi(habit, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      invalidateStats();
    },
  });

  const deleteHabit = useMutation({
    mutationFn: (id: string) => deleteHabitApi(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      invalidateStats();
    },
  });

  const toggle = useMutation({
    mutationFn: (id: string) => toggleHabitLog(id, token!),
    onSuccess: (resp: ToggleResponse) => {
      if (resp?.habit) {
        // Atualiza cache com hábito atualizado
        queryClient.setQueryData<Habit[]>(["habits"], (old) =>
          old ? old.map((h) => (h.id === resp.habit.id ? resp.habit : h)) : [resp.habit]
        );
      }
      if (resp?.stats) {
        queryClient.setQueryData(["dailyStats"], resp.stats);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
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

export default useHabits;
