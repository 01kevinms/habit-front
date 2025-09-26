import { useTheme } from "./AuthTheme";

export function ThemeToggle() {
  const { theme, toggleTheme, isSystemTheme } = useTheme();

  const getThemeIcon = () => {
    if (isSystemTheme) {
      return "🖥️"; // Computer icon for system theme
    }
    return theme === "dark" ? "☀️" : "🌙";
  };

  const getThemeLabel = () => {
    if (isSystemTheme) {
      return `System (${theme})`;
    }
    return theme === "dark" ? "Light" : "Dark";
  };

  const getTooltip = () => {
    if (isSystemTheme) {
      return `Currently following system preference (${theme}). Click to set manual theme.`;
    }
    return `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      <span className="text-lg">
        {getThemeIcon()}
      </span>
      <span className="text-sm font-medium">
        {getThemeLabel()}
      </span>
      {isSystemTheme && (
        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-full">
          Auto
        </span>
      )}
    </button>
  );
}
