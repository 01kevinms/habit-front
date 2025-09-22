import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHabits, createHabit, toggleHabitLog, deleteHabit } from "../services/api";
import { useAuth } from "../services/AuthContext";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  todayStatus: boolean;
}

export interface NewHabit {
  title: string;
  description?: string;
  frequency: string;
}

export function useHabits() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // 1️⃣ Buscar hábitos
  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: () => {
      if (!token) return Promise.resolve([]);
      return getHabits(token);
    },
    enabled: !!token,
  });

  // 2️⃣ Criar hábito
  const create = useMutation({
    mutationFn: (newHabit: NewHabit) => {
      if (!token) throw new Error("Usuário não autenticado");
      return createHabit(newHabit, token);
    },
    onSuccess: (habit: Habit) => {
      queryClient.setQueryData<Habit[]>(["habits"], (old) => (old ? [...old, habit] : [habit]));
    },
  });

  // 3️⃣ Alternar status de hoje
  const toggle = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Usuário não autenticado");
      return toggleHabitLog(id, token);
    },
    onSuccess: (updatedHabit: Habit) => {
      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old ? old.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)) : []
      );
    },
  });
    const remove = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Usuário não autenticado");
      return deleteHabit(id, token);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old ? old.filter((h) => h.id !== id) : []
      );
    },
  });

  return { habits, isLoading, deleteHabit:remove, createHabit: create, toggleHabit: toggle };
}
