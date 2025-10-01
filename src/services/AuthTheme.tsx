import React, { createContext, useContext, useEffect, useState } from "react"; // Importa React e hooks
import type { Theme, ThemeContextType } from "../types/typehabits";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined); // Cria contexto com valor inicial undefined

export const useTheme = () => { // Hook customizado para usar o contexto
  const ctx = useContext(ThemeContext); // Acessa contexto
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider"); // Garante que está dentro do Provider
  return ctx; // Retorna contexto
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { // Provider de tema
  const [theme, setTheme] = useState<Theme>("light"); // Estado do tema, inicia como "light"

  useEffect(() => { // Ao montar componente
    const saved = localStorage.getItem("theme") as Theme | null; // Busca tema salvo
    if (saved) { // Se encontrou
      setTheme(saved); // Define como tema atual
      document.documentElement.classList.toggle("dark", saved === "dark"); // Adiciona/remove classe no HTML
    } else {
      document.documentElement.classList.remove("dark"); // Remove "dark" se não houver
    }
  }, []); // Executa só uma vez

  const toggleTheme = () => { // Função para alternar tema
    const newTheme: Theme = theme === "dark" ? "light" : "dark"; // Define novo tema
    setTheme(newTheme); // Atualiza estado
    document.documentElement.classList.toggle("dark", newTheme === "dark"); // Atualiza classe HTML
    localStorage.setItem("theme", newTheme); // Salva no localStorage
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}> {/* Provedor do contexto */}
      {children} {/* Renderiza os filhos */}
    </ThemeContext.Provider>
  );
};
