import type { NewHabit, Habit, ToggleResponse } from "../types/typehabits"; 
const API_URL = import.meta.env?.VITE_API_URL as string; // Define a URL base da API a partir do arquivo .env

// Função auxiliar que trata a resposta da API
async function handleResponse<T>(res: Response): Promise<T> { // Recebe a resposta do fetch
  const text = await res.text(); // Converte a resposta em texto
  let data: any = null; // Inicializa a variável data

  try { 
    data = text ? JSON.parse(text) : null; // Tenta converter a resposta em JSON se houver texto
  } catch { 
    data = text; // Se não for JSON válido, mantém o texto puro
  }

  if (!res.ok) { // Se a resposta não for bem-sucedida (status >= 400)
    const errorMessage = // Define a mensagem de erro
      typeof data === "string" // Se a resposta for string, usa diretamente
        ? data 
        : data?.message || data?.error || res.statusText || "Erro desconhecido"; // Caso contrário, tenta pegar mensagem/erro
    throw new Error(errorMessage); // Lança erro
  }

  return data as T; // Retorna os dados no tipo esperado
}

// Função genérica para fazer requisições à API
export async function apiFetch<T = any>( // 
  path: string,                // Caminho da API
  options: RequestInit = {},   // Configurações da requisição (GET, POST, etc.)
  token?: string               // Token opcional
): Promise<T> {
  const authToken = token ?? localStorage.getItem("token") ?? undefined; // Usa token recebido ou do localStorage

  const headers: Record<string, string> = { // Cria os headers
    ...(options.headers ? (options.headers as Record<string, string>) : {}), // Se já existirem headers, mantém
  };

  if (options.body && !headers["Content-Type"]) { // Se tiver corpo e não tiver Content-Type
    headers["Content-Type"] = "application/json"; // Define como JSON
  }

  if (authToken) { // Se houver token
    headers["Authorization"] = `Bearer ${authToken}`; // Adiciona ao header
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers }); // Faz a requisição usando fetch
  return handleResponse<T>(res); // Trata a resposta e retorna
}

// ---------------- AUTH ----------------

// Login do usuário
export async function loginUser(email: string, password: string) { // Recebe email e senha
  return apiFetch<{ token: string; user: any }>("/auth/login", { // Chama a API de login
    method: "POST", // Método POST
    body: JSON.stringify({ email, password }), // Envia credenciais no corpo
  });
}

// Registro de novo usuário
export async function registerUser(name: string, email: string, password: string) { // Recebe nome, email e senha
  return apiFetch<{ token: string; user: any }>("/auth/register", { // Chama a API de registro
    method: "POST", // Método POST
    body: JSON.stringify({ name, email, password }), // Envia dados no corpo
  });
}

// ---------------- HABITS ----------------

// Pega lista de hábitos
export async function getHabits(token?: string): Promise<Habit[]> { // Recebe token opcional
  return apiFetch<Habit[]>("/api/habit", { method: "GET" }, token); // Faz GET na rota de hábitos
}

// Cria novo hábito
export async function createHabitApi(habit: NewHabit, token?: string) { // Recebe um objeto habit
  return apiFetch<Habit>( // Retorna o hábito criado
    "/api/habit", // Endpoint da API
    { method: "POST", body: JSON.stringify(habit) }, // Envia hábito como JSON
    token // Token opcional
  );
}

// Deleta hábito pelo ID
export async function deleteHabitApi(id: string, token?: string) { // Recebe id do hábito
  return apiFetch<void>(`/api/habit/${id}`, { method: "DELETE" }, token); // Chama DELETE na API
}

// Alterna log de hábito (concluído/não concluído)
export async function toggleHabitLog( 
  id: string, // ID do hábito
  token?: string // Token opcional
): Promise<ToggleResponse> {
  return apiFetch<ToggleResponse>( // Chama API
    `/api/habit/${id}/logs/toggle`, // Endpoint para alternar log
    { method: "POST" }, // Usa POST para alterar
    token // Token de autenticação
  );
}

// ---------------- STATS ----------------

// Estatísticas diárias
export async function getDailyStats(token: string) { // Precisa do token
  return apiFetch<{ completedToday: number; totalHabits: number; percent: number }>( // Retorna estatísticas
    "/api/stat/daily", // Endpoint
    { method: "GET" }, // GET
    token // Token
  );
}

// Estatísticas semanais
export async function getWeeklyStats(token?: string) { // Token opcional
  return apiFetch<{ day: string; percent: number }[]>( // Retorna lista de dias com percentuais
    "/api/stat/weekly", // Endpoint
    { method: "GET" }, // GET
    token // Token
  );
}

// Estatísticas mensais
export async function getMonthlyStats(token?: string) { // Token opcional
  return apiFetch<{ week: string; percent: number }[]>( // Retorna lista de semanas com percentuais
    "/api/stat/monthly",    // Endpoint
    { method: "GET" },      // GET
    token                   // Token
  );
}

// Streak (sequência de hábitos concluídos)
export async function getStreak(token?: string) { // Token opcional
  return apiFetch<{ maxStreak: number; currentStreak: number }>( // Retorna maior e atual streak
    "/api/stat/streak", // Endpoint
    { method: "GET" },  // GET
    token // Token
  );
}
