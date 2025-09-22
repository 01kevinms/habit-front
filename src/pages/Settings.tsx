

import { ThemeToggle } from "../services/ThemeToggle";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Configurações
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Preferências e ajustes da conta.
        </p>
      </div>

      <div className="mt-4">
        <ThemeToggle />
     
      </div>
    </div>
  );
}
