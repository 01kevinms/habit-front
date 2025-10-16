import { useQuery } from "@tanstack/react-query"; 
import {getWeeklyStats,getMonthlyStats, getStreak,getHabits, } from "../services/api";
import type { Habit } from "../types/manytypes"; 
import { useAuth } from "../services/AuthContext";

export function useDashboard() {

 const { token } = useAuth()
 const { data: weekly = [], isLoading: loadingWeekly } = useQuery({
    queryKey: ["weeklyStats"], // chave única do cache
    queryFn: () => getWeeklyStats(token!), // função que busca dados
    enabled: !!token, // só executa se houver token
  });

  // Busca estatísticas mensais
  const { data: monthly = [], isLoading: loadingMonthly } = useQuery({
    queryKey: ["monthlyStats"],
    queryFn: () => getMonthlyStats(token!),
    enabled: !!token,
  });

  // Busca estatísticas de streak (dias seguidos)
  const { data: streak, isLoading: loadingStreak } = useQuery({
    queryKey: ["streak"],
    queryFn: () => getStreak(token!),
    enabled: !!token,
  });

  // Busca hábitos cadastrados
  const { data: habits = [] } = useQuery<Habit[]>({
    queryKey: ["habitsDashboard"],
    queryFn: () => getHabits(token!),
    enabled: !!token,
  });

  return { weekly, monthly, streak, loadingStreak, habits, loadingWeekly, loadingMonthly };
}