import { useDashboard } from "../hooks/useDashboard";
import { useDiets } from "../hooks/useDiet";
import { useWaterProgress } from "../hooks/useStatus";
import { useAuth } from "../services/AuthContext"; 
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line} from "recharts";

export default function Dashboard() {
  const { user,token } = useAuth();
  const { dietProgress, loadingDiet, data } = useDiets();
  const { weekly, monthly, streak, loadingStreak, habits, loadingWeekly, loadingMonthly } = useDashboard();
  const { WaterProgress} = useWaterProgress(token!);

  const todayKey = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  // ------------------- HÁBITOS -------------------
  const feitosHoje = habits.filter(h =>
    Boolean(h.logs?.some(l => l.dayKey === todayKey && l.status))
  ).length;
  const totalHabitos = habits.length;

  // ------------------- DIETA -------------------
  const todayDiet = dietProgress?.today;
  const dietMeta = data?.meta ?? 0;
  const dietWeekMeta = (dietMeta * 7).toFixed(1);
  const dietPercentage = todayDiet ? todayDiet.percentage : 0;

  // ------------------- ÁGUA -------------------
const today = WaterProgress?.today;




  if (loadingDiet) return <p>Carregando progresso...</p>;

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      {/* Saudação */}
      <h1 className="text-3xl font-bold text-center mb-6">👋 Bem-vindo(a), {user?.name}</h1>

      {/* ------------------ RESUMOS ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hábitos */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Hábitos</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {feitosHoje}/{totalHabitos} feitos hoje
          </p>
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">🔥 Streak</h3>
          {loadingStreak ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
          ) : streak ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Atual: <span className="font-semibold">{streak.currentStreak}</span> dias <br />
              Máxima: <span className="font-semibold">{streak.maxStreak}</span> dias
            </p>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm">Sem dados ainda</p>
          )}
        </div>

        {/* Semana */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">📅 Semana</h3>
          {loadingWeekly ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Média:{" "}
              <span className="font-semibold">
                {weekly.length > 0 ? Math.round(weekly.reduce((acc, d) => acc + d.percent, 0) / weekly.length) : 0}%
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ------------------ CARDS DE DIETA E ÁGUA ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Dieta */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Progresso da dieta</h2>
          {todayDiet ? (
            <>
              <p>Meta Semanal: {dietWeekMeta} kcal</p>
              <p>Consumido: {todayDiet.calories.toFixed(2)} kcal</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className={`h-4 rounded-full ${todayDiet.achieved ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${dietPercentage}%` }}
                />
              </div>
              <p className="text-md text-gray-400 mt-1">
                {todayDiet.achieved ? "Meta atingida! 🎉" : "Continue firme 💪"}
              </p>
              <p>{dietPercentage.toFixed(1)}% da meta de {dietWeekMeta} kcal</p>
            </>
          ) : <p>Nenhum dado ainda</p>}
        </div>

        {/* Card Água */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold mb-2">💧 Consumo de água diário</h2>
          <p>Consumido: {today?.water} ml</p>
          <p>Meta: {today?.goal} ml</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="h-4 rounded-full bg-blue-500"
              style={{ width: `${today?.percentage || 0}%` }}
            />
          </div>
          {today?.percentage !== undefined && today?.percentage >= 100 && <p className="text-green-500 mt-1">Meta atingida! 🎉</p>}
        </div>
      </div>

      {/* -------------------- GRÁFICOS -------------------- */}
      <div className="gap-3 grid">
        <h2 className="text-xl font-semibold mb-4">Estatísticas dos Hábitos</h2>

        {/* Gráfico Semanal */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4">Progresso Semanal</h2>
          {loadingWeekly ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="0.6 0.1" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percent" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        {/* Gráfico Mensal */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4">Progresso Mensal</h2>
          {loadingMonthly ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="0.6 0.1" />
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
    </div>
  );
}
