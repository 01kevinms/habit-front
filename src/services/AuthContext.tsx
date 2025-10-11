import { createContext, useContext, useState, useEffect, type ReactNode } from "react"; 
import { loginUser, registerUser } from "./api"; 
import type { AuthContextType, User } from "../types/manytypes";


const AuthContext = createContext<AuthContextType>({} as AuthContextType); // Cria o contexto com tipagem

export const AuthProvider = ({ children }: { children: ReactNode }) => { // Provider que envolve a aplicação
  const [token, setToken] = useState<string | null>(null); // Estado para token
  const [user, setUser] = useState<User | null>(null); // Estado para usuário

  useEffect(() => { // Executa ao montar componente
    const storedToken = localStorage.getItem("token"); // Busca token no localStorage
    const storedUser = localStorage.getItem("user"); // Busca usuário no localStorage
    if (storedToken) setToken(storedToken); // Se encontrou token, define no estado
    if (storedUser) setUser(JSON.parse(storedUser)); // Se encontrou user, converte JSON e define
  }, []); // Apenas na montagem

  const login = async (email: string, password: string) => { // Função login
    const { token, user } = await loginUser(email, password); // Chama API login
    setToken(token); // Salva token no estado
    setUser(user); // Salva usuário no estado
    localStorage.setItem("token", token); // Salva token no localStorage
    localStorage.setItem("user", JSON.stringify(user)); // Salva usuário no localStorage
  };

  const register = async (name: string, email: string, password: string) => { // Função registro
    const { token, user } = await registerUser(name, email, password); // Chama API registro
    setToken(token); // Define token
    setUser(user); // Define usuário
    localStorage.setItem("token", token); // Salva token no localStorage
    localStorage.setItem("user", JSON.stringify(user)); // Salva usuário no localStorage
  };

  const logout = () => { // Função logout
    setToken(null); // Limpa token
    setUser(null); // Limpa usuário
    localStorage.removeItem("token"); // Remove token do localStorage
    localStorage.removeItem("user"); // Remove usuário do localStorage
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}> {/* Contexto expõe valores */}
      {children} {/* Renderiza os filhos */}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto em qualquer componente
export const useAuth = () => useContext(AuthContext); 
