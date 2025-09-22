import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert("Erro ao registrar");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 dark:bg-gray-900 transition-colors">
      <div className="absolute top-4 right-4">
     
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 w-96 space-y-4 transition-colors"
      >
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100">Registrar</h2>
        <input
          type="text"
          placeholder="Nome"
          autoComplete="name"
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          autoComplete="current-password"
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          Registrar
        </button>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Já tem conta?{" "}
          <Link 
            to="/login" 
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline transition-colors"
          >
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
