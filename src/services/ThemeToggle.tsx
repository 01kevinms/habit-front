import { useTheme } from "./AuthTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => (theme === "dark" ? "☀️" : "🌙");
  const getThemeLabel = () => (theme === "dark" ? "Light" : "Dark");
  const getTooltip = () =>
    `Switch to ${theme === "dark" ? "light" : "dark"} mode`;

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      <span className="text-lg">{getThemeIcon()}</span>
      <span className="text-sm font-medium">{getThemeLabel()}</span>
    </button>
  );
}
