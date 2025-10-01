import { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Home, User, Settings, ListTodo, Menu } from "lucide-react";
import { useAuth } from "../services/AuthContext";

// Componente de layout do Dashboard
// Inclui sidebar (menu lateral), header e área de conteúdo dinâmico
export default function DashboardLayout() {
  const { logout } = useAuth(); // função de logout
  const navigate = useNavigate(); // navegação programática
  const [sidebarOpen, setSidebarOpen] = useState(true); // controla se a sidebar está aberta

  // Função chamada ao clicar em "Logout"
  const handleLogout = () => {
    logout();          // remove dados de autenticação
    navigate("/login"); // redireciona para tela de login
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* -------------------- SIDEBAR -------------------- */}
      {sidebarOpen && (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-colors">
          {/* Cabeçalho da sidebar (logo/título) */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Meu App
            </h1>
          </div>

          {/* Navegação lateral */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
            >
              <Home size={20} />
              Início
            </Link>
            <Link
              to="/dashboard/stats"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
            >
              <User size={20} />
              Estatísticas
            </Link>
            <Link
              to="/dashboard/habits"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
            >
              <ListTodo size={20} />
              Hábitos
            </Link>
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
            >
              <Settings size={20} />
              Configurações
            </Link>
          </nav>

          {/* Botão de logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* -------------------- CONTEÚDO -------------------- */}
      <div className="flex-1 flex flex-col">
        {/* Header superior */}
        <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center transition-colors">
          <div className="flex items-center gap-4">
            {/* Botão para alternar visibilidade da sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Dashboard
            </h2>
          </div>

          {/* Mensagem de boas-vindas */}
          <span className="text-gray-500 dark:text-gray-300">
            Bem-vindo 👋
          </span>
        </header>

        {/* Área de conteúdo principal (renderiza rotas filhas) */}
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
