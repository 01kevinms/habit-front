import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDiets, getDietProgress, createDietApi, deleteDietApi, updateDietApi, apiFetch, deleteFoodApi, updateDietProgress } from "../services/api";
import { useAuth } from "../services/AuthContext";
import type { DietResponse, NewDiet, NewFoodForBackend } from "../types/manytypes";


export function useDiets() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

const { data: dietProgress, isLoading:loadingDiet } = useQuery({
  queryKey: ["dietProgress", token],
  queryFn: () => getDietProgress(token!),
  enabled: !!token,
});

  // Atualiza a meta
  const updateGoal = useMutation({
    mutationFn:(goal: number) => updateDietProgress({ goal }, token!),
    onSuccess: () => { queryClient.invalidateQueries({queryKey:["dietProgress"]});},
});

  // Query para buscar dietas
  const { data, isLoading } = useQuery<DietResponse>({
    queryKey: ["diets"],
    queryFn: () => getDiets(token!),
    enabled: !!token,
  });

  // Criar dieta
  const createDiet = useMutation({
    mutationFn: (diet: NewDiet) => createDietApi(diet, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diets"] }),
  });

  // Deletar dieta
  const deleteDiet = useMutation({
    mutationFn: (id: string) => deleteDietApi(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diets"] }),
  });
const deleteFood = useMutation({
  mutationFn: ({id, dietId}: {id: string; dietId: string})=> 
    deleteFoodApi(id, dietId, token!),
  onSuccess:()=> queryClient.invalidateQueries({queryKey:["diets"]})
})
  // Atualizar dieta inteira
  const updateDiet = useMutation({
    mutationFn: ({ id, diet }: { id: string; diet: NewDiet }) => updateDietApi(id, diet, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diets"] }),
  });

  // Atualizar apenas um alimento (grams)
  const updateFood = useMutation({
    mutationFn: async ({ dietId, id, grams }: { dietId: string; id: string; grams: number }) =>
      apiFetch(`/api/diet/${dietId}/food/${id}`, {
        method: "PUT",
        body: JSON.stringify({ grams }),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diets"] }),
  });

const addNewFoodToDiet = useMutation({
  mutationFn: async ({ dietId, food }: { dietId: string; food: Omit<NewFoodForBackend, "id"> }) =>
    apiFetch(`/api/diet/${dietId}/food`, {
      method: "POST",
      body: JSON.stringify(food),
      headers: { "Content-Type": "application/json" },
    }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diets"] }),
});

  return {
    data,
    diets: data?.diets ?? [],
    totalCalories: data?.totalCalories ?? 0,
    meta: data?.meta ?? 0,
    atingiumeta: data?.atingiumeta ?? false,
    isLoading,
    createDiet,
    deleteDiet,
    deleteFood,
    updateDiet,
    updateFood,
    addNewFoodToDiet,
   dietProgress,
   loadingDiet,
   updateGoal,
  };
}
