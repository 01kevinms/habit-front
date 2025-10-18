import { type NewHabit, type Habit, type ToggleResponse, type Diet, type NewDiet, type NewStatus, type Status, type DietResponse, DietProgress, waterResponse, WaterProgress} from "../types/manytypes"; 
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
export async function getDiets(token?: string): Promise<DietResponse> {
  return apiFetch<DietResponse>("/api/diet", { method: "GET" }, token);
}
export async function getDietProgress(token?: string) {
  return apiFetch("/api/diet/progress", { method: "GET" }, token);
}
export async function updateDietProgress(data:DietProgress,token?:string): Promise<DietProgress[]> {
  return apiFetch<DietProgress[]>("/api/diet/progress",{
    method: "POST",
    body: JSON.stringify(data)
  }, token)
}
export async function createDietApi(diet: NewDiet, token: string): Promise<DietResponse> {
  return apiFetch<DietResponse>("/api/diet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(diet),
  }, token);
}

export async function deleteDietApi(id: string, token: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/api/diet/${id}`, {
    method: "DELETE",
  }, token);
}

export async function updateDietApi(id: string, diet: NewDiet, token: string): Promise<Diet> {
  return apiFetch<Diet>(`/api/diet/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(diet),
  }, token);
}

export async function getStatusApi(token?: string): Promise<Status[]> {
  return apiFetch<Status[]>("/api/status", { method: "GET" }, token);
}
export async function getWaterApi(token?: string): Promise<waterResponse> {
  return apiFetch<waterResponse>("/api/status/water", { method: "GET" }, token);
}
export async function createStatus(status: NewStatus, token: string): Promise<Status> {
  return apiFetch<Status>("/api/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(status),
  }, token);
}
export async function updateWaterApi(id: string, water: number, token: string): Promise<WaterProgress> {
  return apiFetch<WaterProgress>(`/api/status/${id}/water`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({water}),
  }, token);
}   

export async function deleteStatusApi(id: string, token: string): Promise<Status> {
  return apiFetch<Status>(`/api/status/${id}`, { method: "DELETE" }, token);
}
// https://habit-back.onrender.com
export async function searchfoodapi(query: string) {
  const res = await fetch("http://localhost:3001/api/food/nutritionix/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar alimento");
  }

  return res.json(); // retorna a lista de foods
}
export async function deleteFoodApi(id: string, dieId: string, token: string):Promise<{success: boolean}>{
  return apiFetch<{success: boolean}>(`/api/diet/${dieId}/food/${id}`,{
    method: "DELETE",
  },token)
}
