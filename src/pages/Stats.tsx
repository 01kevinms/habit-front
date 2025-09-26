import { useQuery } from "@tanstack/react-query";
import {
  getWeeklyStats,
  getMonthlyStats,
  getDailyStats,
  getStreak,
} from "../services/api";
import { useAuth } from "../services/AuthContext";
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

export default function Stats() {
  const { token } = useAuth();

  const { data: daily } = useQuery({
    queryKey: ["dailyStats"],
    queryFn: () => getDailyStats(token!),
    enabled: !!token,
  });


  const { data: weekly = [] } = useQuery({
    queryKey: ["weeklyStats"],
    queryFn: () => getWeeklyStats(token!),
    enabled: !!token,
  });

  const { data: monthly = [] } = useQuery({
    queryKey: ["monthlyStats"],
    queryFn: () => getMonthlyStats(token!),
    enabled: !!token,
  });

  const { data: streak } = useQuery({
    queryKey: ["streak"],
    queryFn: () => getStreak(token!),
    enabled: !!token,
  });

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center">📊 Status dos Hábitos</h1>

      {/* Progresso Diário */}
      {daily && (
        <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Progresso Diário</h2>
          <p className="text-lg">
            <span className="font-bold">{daily.completedToday}</span> de{" "}
            <span className="font-bold">{daily.totalHabits}</span> hábitos (
            <span className="font-bold">{daily.percent}%</span>)
          </p>
        </section>
      )}

      {/* Progresso Semanal */}
      <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Progresso Semanal</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="percent" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Progresso Mensal */}
      <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Progresso Mensal</h2>
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
      </section>

      {/* Streaks */}
      {streak && (
        <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 text-center">
          <h2 className="text-xl font-semibold mb-4">🔥 Séries (Streaks)</h2>
          <p className="text-lg">
            Atual: <span className="font-bold">{streak.currentStreak}</span> dias
          </p>
          <p className="text-lg">
            Máximo: <span className="font-bold">{streak.maxStreak}</span> dias
          </p>
        </section>
      )}
    </div>
  );
}
