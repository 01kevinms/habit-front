import { useQuery } from "@tanstack/react-query"; 
import {
  getWeeklyStats,
  getMonthlyStats, 
  getStreak,
  getHabits, 
} from "../services/api";
import { useAuth } from "../services/AuthContext"; 
import type { Habit } from "../types/manytypes"; 
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

// Página de dashboard principal
export default function Dashboard() {
  const { token, user } = useAuth(); // Obtém token e dados do usuário autenticado

  // Busca estatísticas semanais
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

  // Chave do dia atual no formato YYYY-MM-DD
  const todayKey = new Date().toISOString().split("T")[0]; // pega só a data

  // Calcula quantos hábitos foram feitos hoje
  const feitosHoje = habits.filter((h) =>
    Boolean(h.logs?.some((l) => l.dayKey === todayKey && l.status))
  ).length;

  // Quantidade total de hábitos
  const totalHabitos = habits.length;

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      {/* Saudação com o nome do usuário */}
      <h1 className="text-3xl font-bold text-center mb-6">
        👋 Bem-vindo(a), {user?.name}
      </h1>

      {/* ------------------ Resumo principal ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bloco de hábitos */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            Hábitos
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {feitosHoje}/{totalHabitos} feitos hoje
          </p>
        </div>

        {/* Bloco de streak */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            🔥 Streak
          </h3>
          {loadingStreak ? ( // Se estiver carregando
            <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
          ) : streak ? ( // Se houver dados
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Atual: <span className="font-semibold">{streak.currentStreak}</span>{" "}
              dias <br />
              Máxima: <span className="font-semibold">{streak.maxStreak}</span> dias
            </p>
          ) : ( // Caso não tenha dados
            <p className="text-gray-400 dark:text-gray-500 text-sm">Sem dados ainda</p>
          )}
        </div>

        {/* Bloco da semana */}
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

      {/* -------------------- Gráfico Semanal -------------------- */}
      <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Progresso Semanal</h2>
        {loadingWeekly ? ( // Mostra carregando
          <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
        ) : (
          // ✅ Aqui o ResponsiveContainer tem apenas 1 filho (BarChart)
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekly}> {/* Gráfico de barras */}
              <CartesianGrid strokeDasharray="3 3" /> {/* Linhas de grade */}
              <XAxis dataKey="day" /> {/* Define eixo X com dias */}
              <YAxis /> {/* Define eixo Y */}
              <Tooltip /> {/* Tooltip ao passar o mouse */}
              <Bar dataKey="percent" fill="#6366f1" radius={[6, 6, 0, 0]} /> {/* Barras */}
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* -------------------- Gráfico Mensal -------------------- */}
      <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Progresso Mensal</h2>
        {loadingMonthly ? ( // Mostra carregando
          <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
        ) : (
          // container responsivo
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthly}> 
              <CartesianGrid strokeDasharray="3 3" /> 
              <XAxis dataKey="week" /> 
              <YAxis /> 
              <Tooltip /> 
              <Line
                type="monotone" // Tipo de curva da linha
                dataKey="percent" // Usa a porcentagem como valor
                stroke="#10b981" // Cor verde
                strokeWidth={3} // Espessura da linha
                dot={{ r: 5, fill: "#10b981" }} // Estilo dos pontos
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}
