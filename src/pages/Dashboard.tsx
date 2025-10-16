import { useDashboard } from "../hooks/useDashboard";
import { useDiets } from "../hooks/useDiet";
import { useAuth } from "../services/AuthContext"; 
import {BarChart,Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,LineChart, Line, } from "recharts";

export default function Dashboard() {
  const { user } = useAuth(); // Obtém token e dados do usuário autenticado
  const { dietProgress,loadingDiet,data } = useDiets();
  // Busca estatísticas semanais
  const {weekly, monthly,streak,loadingStreak, habits, loadingWeekly, loadingMonthly} = useDashboard()
  
  // Chave do dia atual no formato YYYY-MM-DD
  const todayKey = new Date().toISOString().split("T")[0]; // pega só a data

  // Calcula quantos hábitos foram feitos hoje
  const feitosHoje = habits.filter((h) =>
    Boolean(h.logs?.some((l) => l.dayKey === todayKey && l.status))
  ).length;

  // Quantidade total de hábitos
  const totalHabitos = habits.length;
   if (loadingDiet) return <p>Carregando progresso...</p>;

const today = dietProgress?.today;
const percentage = today ? today.percentage : 0;
const meta = data?.meta ?? 0
const weekmeta = (meta * 7).toFixed(1)
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
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
      <h2 className="text-xl font-bold mb-2">Progresso da dieta</h2>
      {today ? (
        <>
          <p>Meta Semanal: {weekmeta} kcal</p>
          <p>Consumido: {today.calories.toFixed(2)} kcal</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className={`h-4 rounded-full ${
                today.achieved ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-md text-gray-400 mt-1">
            {today.achieved ? "Meta atingida! 🎉" : "Continue firme 💪"}
          </p>
          <p>
  {today.percentage.toFixed(1)}% da meta de {weekmeta} kcal
</p>

        </>
      ) : (
        <p>Nenhum dado ainda</p>
      )}
    </div>
      </div>
      {/* -------------------- Gráfico Semanal -------------------- */}
      <div className="gap-3 grid">
        <h2 className="text-xl font-semibold mb-4">Estatísticas dos Hábitos</h2>
      <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Progresso Semanal</h2>
        {loadingWeekly ? ( // Mostra carregando
          <p className="text-gray-400 dark:text-gray-500 text-sm">Carregando...</p>
        ) : (
          // ✅ Aqui o ResponsiveContainer tem apenas 1 filho (BarChart)
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekly}> {/* Gráfico de barras */}
              <CartesianGrid strokeDasharray="0.6 0.1" /> {/* Linhas de grade */}
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
              <CartesianGrid strokeDasharray="0.6 0.1" /> 
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
    </div>
  );
}
