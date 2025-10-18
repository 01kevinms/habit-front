// ./services/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Componente que protege rotas
export default function PrivateRoute() {
  const { token, loading } = useAuth();

  if (loading) return <div>carregando...</div>
  // Se não estiver logado, redireciona para login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza as rotas internas
  return <Outlet />;
}
