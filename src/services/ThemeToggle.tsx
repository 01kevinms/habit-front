import { useTheme } from "./AuthTheme"; // Importa hook do contexto de tema

export function ThemeToggle() { // Botão de alternar tema
  const { theme, toggleTheme } = useTheme(); // Pega valores do contexto

  const getThemeIcon = () => (theme === "dark" ? "☀️" : "🌙"); // Ícone depende do tema
  const getThemeLabel = () => (theme === "dark" ? "Light" : "Dark"); // Texto depende do tema
  const getTooltip = () => // Tooltip com instrução
    `Switch to ${theme === "dark" ? "light" : "dark"} mode`;

  return (
    <button
      onClick={toggleTheme} // Alterna o tema ao clicar
      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md" // Estilização
      title={getTooltip()} // Texto do tooltip
      aria-label={getTooltip()} // Acessibilidade
    >
      <span className="text-lg">{getThemeIcon()}</span> {/* Ícone do botão */}
      <span className="text-sm font-medium">{getThemeLabel()}</span> {/* Texto do botão */}
    </button>
  );
}
