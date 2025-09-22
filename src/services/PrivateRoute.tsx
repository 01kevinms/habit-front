// ./services/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Componente que protege rotas
export default function PrivateRoute() {
  const { token } = useAuth();

  // Se não estiver logado, redireciona para login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza as rotas internas
  return <Outlet />;
}
