// Hooks do React Query usados para buscar e mutar dados e para manipular o cache
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Funções que fazem chamadas ao backend (API)
import {
  getHabits,
  createHabitApi,
  deleteHabitApi,
  toggleHabitLog,
} from "../services/api";

// Hook de autenticação para pegar o token do usuário
import { useAuth } from "../services/AuthContext";

// Tipagens usadas pelo hook
import type { Habit, NewHabit, ToggleResponse } from "../types/typehabits";

export function useHabits() {
  // Pega o token do contexto de autenticação (necessário para as chamadas protegidas)
  const { token } = useAuth();

  // Cliente do React Query para manipular cache/invalidações
  const queryClient = useQueryClient();

  // -------------------- Busca de hábitos --------------------
  // useQuery para obter a lista de hábitos do backend
  const { data, isLoading } = useQuery<Habit[]>({
    queryKey: ["habits"], // chave do cache para esta query
    queryFn: () => getHabits(token!), // função que busca os hábitos (usa token)
    enabled: !!token, // só executa se houver token (usuário autenticado)
    staleTime: 1000 * 30, // tempo em ms que os dados são considerados "frescos" (30s)
    gcTime: 1000 * 60 * 5, // tempo em ms para o garbage collect do cache (5min)
  });

  // Garante que sempre teremos um array (evita undefined)
  const habits = data ?? []; // ✅ sempre array

  // -------------------- Função auxiliar para invalidar estatísticas --------------------
  // Ao mudar hábitos, precisamos atualizar também as queries de estatísticas
  const invalidateStats = () => {
    queryClient.invalidateQueries({ queryKey: ["dailyStats"] });
    queryClient.invalidateQueries({ queryKey: ["weeklyStats"] });
    queryClient.invalidateQueries({ queryKey: ["monthlyStats"] });
    queryClient.invalidateQueries({ queryKey: ["streak"] });
  };

  // -------------------- Mutação: criar hábito --------------------
  const createHabit = useMutation({
    mutationFn: (habit: NewHabit) => createHabitApi(habit, token!),
    onSuccess: () => {
      // Após criar, invalida a lista de hábitos e as estatísticas relacionadas
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      invalidateStats();
    },
  });

  // -------------------- Mutação: deletar hábito --------------------
  const deleteHabit = useMutation({
    mutationFn: (id: string) => deleteHabitApi(id, token!),
    onSuccess: () => {
      // Após deletar, invalida a lista de hábitos e as estatísticas relacionadas
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      invalidateStats();
    },
  });

  // -------------------- Mutação: alternar log de hábito --------------------
  const toggle = useMutation({
    mutationFn: (id: string) => toggleHabitLog(id, token!),
    onSuccess: (resp: ToggleResponse) => {
      // Se a resposta trouxer o hábito atualizado, atualiza o cache localmente
      if (resp?.habit) {
        queryClient.setQueryData<Habit[]>(["habits"], (old) =>
          old ? old.map((h) => (h.id === resp.habit.id ? resp.habit : h)) : [resp.habit]
        );
      }
      // Se a resposta trouxer estatísticas atualizadas, atualiza a query de dailyStats diretamente
      if (resp?.stats) {
        queryClient.setQueryData(["dailyStats"], resp.stats);
      }
    },
    onSettled: () => {
      // Ao finalizar a mutação (com sucesso ou erro), invalida para garantir consistência
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      invalidateStats();
    },
  });

  // -------------------- Retorno do hook --------------------
  return {
    habits,
    isLoading,
    createHabit,
    deleteHabit,
    toggle,
  };
}

// Export default para facilitar importação
export default useHabits;
