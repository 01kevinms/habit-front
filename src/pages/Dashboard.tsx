// pages/Dashboard.tsx
import { useQuery } from "@tanstack/react-query";
import {
  getWeeklyStats,
  getMonthlyStats,
  getStreak,
  getHabits,
} from "../services/api";
import { useAuth } from "../services/AuthContext";
import type { Habit } from "../types/typehabits";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function Dashboard() {
  const { token, user } = useAuth();

  const { data: weekly = [], isLoading: loadingWeekly } = useQuery({
    queryKey: ["weeklyStats"],
    queryFn: () => getWeeklyStats(token!),
    enabled: !!token,
  });

  const { data: monthly = [], isLoading: loadingMonthly } = useQuery({
    queryKey: ["monthlyStats"],
    queryFn: () => getMonthlyStats(token!),
    enabled: !!token,
  });

  const { data: streak, isLoading: loadingStreak } = useQuery({
    queryKey: ["streak"],
    queryFn: () => getStreak(token!),
    enabled: !!token,
  });

  // aqui forçamos o tipo para Habit[]
  const { data: habits = [] } = useQuery<Habit[]>({
    queryKey: ["habitsDashboard"],
    queryFn: () => getHabits(token!),
    enabled: !!token,
  });

  const todayKey = new Date().toISOString().split("T")[0];

  const feitosHoje = habits.filter((h) =>
    Boolean(h.logs?.some((l) => l.dayKey === todayKey && l.status))
  ).length;

  const totalHabitos = habits.length;

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        👋 Bem-vindo(a), {user?.name}
      </h1>

      {/* resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            Hábitos
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {feitosHoje}/{totalHabitos} feitos hoje
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            🔥 Streak
          </h3>
          {loadingStreak ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
          ) : streak ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Atual: <span className="font-semibold">{streak.currentStreak}</span>{" "}
              dias <br />
              Máxima: <span className="font-semibold">{streak.maxStreak}</span> dias
            </p>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm">Sem dados ainda</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            📅 Semana
          </h3>
          {loadingWeekly ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Média:{" "}
              <span className="font-semibold">
                {weekly.length > 0
                  ? Math.round(
                      weekly.reduce((acc, d) => acc + d.percent, 0) / weekly.length
                    )
                  : 0}
                %
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Gráficos (semana / mês) */}
      <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Progresso Semanal</h2>
        {loadingWeekly ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percent" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Progresso Mensal</h2>
        {loadingMonthly ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="percent"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}
