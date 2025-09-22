import { useState } from "react";
import { useHabits, type NewHabit } from "../hooks/useHabits";
import { motion, AnimatePresence } from "framer-motion";

export default function Habits() {
  const { habits, isLoading, createHabit, toggleHabit: toggle, deleteHabit } = useHabits();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newHabit: NewHabit = { title, description, frequency };
    createHabit.mutate(newHabit);
    setTitle("");
    setDescription("");
    setFrequency("daily");
  };

  if (isLoading) return <p>Carregando hábitos...</p>;

  const frequencyColor = (freq: string) => {
    switch (freq) {
      case "daily":
        return "bg-blue-500";
      case "weekly":
        return "bg-purple-500";
      case "monthly":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      {/* Formulário */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 w-full mx-auto">
        <h2 className="text-xl font-bold mb-4">Criar novo hábito</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Criar
          </button>
        </form>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 flex flex-col justify-between"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div>
              <h3 className="text-lg font-bold mb-2">{habit.title}</h3>
              {habit.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-2">{habit.description}</p>
              )}
              <span
                className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${frequencyColor(
                  habit.frequency
                )}`}
              >
                {habit.frequency}
              </span>
            </div>

            <button
              onClick={() => toggle.mutate(habit.id)}
              className={`mt-4 px-4 py-2 rounded font-semibold text-white transition-colors ${
                habit.todayStatus
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-300 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-400"
              }`}
            >
              {habit.todayStatus ? "Feito" : "Marcar"}
            </button>

            <button
              onClick={() => setHabitToDelete(habit.id)}
              className="mt-2 px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
            >
              Excluir
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {habitToDelete && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
              <p className="mb-6">Tem certeza que deseja excluir este hábito?</p>
              <div className="flex justify-around">
                <button
                  onClick={() => setHabitToDelete(null)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    deleteHabit.mutate(habitToDelete);
                    setHabitToDelete(null);
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
