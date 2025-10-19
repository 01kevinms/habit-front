import { useState } from "react";
import { useHabits } from "../hooks/useHabits"; 
import { motion, AnimatePresence } from "framer-motion"; 
import type { NewHabit, Habit } from "../types/manytypes"; 

// Página de gerenciamento de hábitos
export default function Habits() { // Componente principal da página
  const { habits, isLoading, createHabit, toggle, deleteHabit } = useHabits(); // Hook com operações de hábitos

  // Estados do formulário para criar hábito
  const [title, setTitle] = useState(""); // título do hábito
  const [description, setDescription] = useState(""); // descrição opcional
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily"); // frequência padrão = diário
  const [time, setTime]=useState<string>("")
  // Estado que guarda o ID do hábito a ser excluído (para o modal de confirmação)
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  // Função para criar hábito
  const handleCreate = (e: React.FormEvent) => { // Executada no submit do formulário
    e.preventDefault(); // evita recarregar a página
    if (!title.trim()) return; // valida título vazio
    const newHabit: NewHabit = { title, description, frequency, time}; // cria objeto do novo hábito
    createHabit.mutate(newHabit); // chama mutação (requisição para API)
    setTitle(""); // limpa formulário
    setDescription("");
    setTime("")
    setFrequency("daily");
 
  };

  // Exibe mensagem de carregando enquanto busca hábitos
  if (isLoading) return <p>Carregando hábitos...</p>;

  // Função que retorna cor com base na frequência
  const frequencyColor = (freq: string) => { 
    switch (freq) {
      case "daily": return "bg-blue-500";   // diário → azul
      case "weekly": return "bg-purple-500"; // semanal → roxo
      case "monthly": return "bg-yellow-500"; // mensal → amarelo
      default: return "bg-gray-500"; // fallback → cinza
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      {/* -------------------- Formulário de criação -------------------- */}
      <div className="bg-gray-200 dark:bg-gray-800 shadow rounded-xl p-6 w-full mx-auto">
        <h2 className="text-xl font-bold mb-4">Criar novo hábito</h2>
        <form onSubmit={handleCreate} className="space-y-3"> {/* formulário de novo hábito */}
          <input
            type="text" // campo título
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // atualiza estado
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="text" // campo descrição
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // atualiza estado
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="time" // campo descrição
            placeholder="ate que horario fazer"
            value={time}
            onChange={(e) => setTime(e.target.value)} // atualiza estado
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as "daily" | "weekly" | "monthly")} // atualiza frequência
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
          <button
            type="submit" // botão enviar
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Criar
          </button>
        </form>
      </div>

      {/* -------------------- Lista de hábitos -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {habits.map((habit: Habit) => { // percorre hábitos
          const doneToday = habit.todayStatus ?? false; // verifica se foi feito hoje

          return (
            <motion.div
              key={habit.id} // cada card precisa de chave única
              className="bg-gray-200 dark:bg-gray-800 shadow rounded-xl p-3 flex flex-col justify-between"
              whileHover={{ scale: 1.02 }} // animação de hover
              transition={{ type: "spring", stiffness: 200 }} // suavidade da animação
            >
              <div className="bg-gray-300 dark:bg-[#2d3861] rounded">
                <h3 className="text-lg font-bold mb-2 border-b px-2">{habit.title}</h3> {/* título */}
                <div className="inline-flex border-b rounded w-full px-2 place-content-between py-2">
                  <div className="">
                  <p className="text-xs text-gray-600 dark:text-gray-200/60">Descrição</p>
                {habit.description && ( // descrição só se existir
                  <p className="text-gray-900 text-lg dark:text-gray-300 mb-2">
                    {habit.description}
                  </p>
                )}
                </div>

                <div className="grid w-[25%] gap-1">
                <span className={`flex p-1.5 justify-center rounded text-white text-sm font-semibold ${frequencyColor(habit.frequency)}`}>{habit.frequency}</span>
                <span className="bg-[#486AD9] text-white rounded p-1 flex justify-center">{habit.time}</span>
                  </div>

              </div>                
              </div>

              {/* Botão marcar como feito/não feito */}
              <button
                onClick={() => toggle.mutate(habit.id)} // alterna status
                className={`mt-4 px-4 py-1.5 rounded font-semibold text-white transition-colors ${
                  doneToday
                    ? "bg-green-500 hover:bg-green-600" // já feito → verde
                    : "bg-gray-400 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-400" // não feito → cinza
                }`}
              >
                {doneToday ? "Feito" : "Finalizar"} {/* texto muda */}
              </button>

              {/* Botão excluir (abre modal de confirmação) */}
              <button
                onClick={() => setHabitToDelete(habit.id)} // abre modal
                className="mt-2 px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
              >
                Excluir
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* -------------------- Modal de confirmação -------------------- */}
      <AnimatePresence>
        {habitToDelete && ( // só mostra se houver hábito selecionado
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" // fundo escuro
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} 
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80 text-center" // caixa do modal
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }} 
            >
              <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
              <p className="mb-6">Tem certeza que deseja excluir este hábito?</p>
              <div className="flex justify-around">
                {/* Botão cancelar */}
                <button
                  onClick={() => setHabitToDelete(null)} // fecha modal
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancelar
                </button>
                {/* Botão excluir */}
                <button
                  onClick={() => {
                    if (habitToDelete) { // se existir um hábito
                      deleteHabit.mutate(habitToDelete); // chama mutação de exclusão
                      setHabitToDelete(null); // fecha modal
                    }
                  }}
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
