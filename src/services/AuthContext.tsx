// ./services/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { loginUser, registerUser } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
}

// src/services/AuthContext.tsx
interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}




const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Recupera token e usuário do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

const login = async (email: string, password: string) => {
  const { token, user } = await loginUser(email, password);
  setToken(token);
  setUser(user);
  localStorage.setItem("token", token); // ✅ salvar
  localStorage.setItem("user", JSON.stringify(user));
};



  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await registerUser(name, email, password);
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar auth em qualquer componente
export const useAuth = () => useContext(AuthContext);
