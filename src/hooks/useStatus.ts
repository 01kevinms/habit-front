import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../services/AuthContext";
import { getStatusApi, createStatus, deleteStatusApi } from "../services/api";
import { getWaterApi, updateWaterApi } from "../services/api";
import type { NewStatus, Status, waterResponse } from "../types/manytypes";

export function useStatusPhysical() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Status físico do dia
const { data, isLoading } = useQuery<Status[]>({
  queryKey: ["status"],
  queryFn: () => getStatusApi(token!),
  enabled: !!token,
 });

 const status = data ?? [];

  // Cria novo status físico
  const createStatush = useMutation({
    mutationFn: (newStatus: NewStatus) => createStatus(newStatus, token!),
   onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["status"] });
  queryClient.invalidateQueries({ queryKey: ["WaterProgress"] });},
  onError: (error) => console.error("Erro ao criar status físico:", error),
  });

  // Deleta status físico
  const deleteStatus = useMutation({
    mutationFn: (id: string) => deleteStatusApi(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["status"] }),
  });

  return {
    status,
    isLoading,
    createStatush,
    deleteStatus,
  };
}

export function useWaterProgress(token: string) {
  const queryClient = useQueryClient();

  const { data: WaterProgress, isLoading: Loadingwater } = useQuery<waterResponse>({
    queryKey: ["WaterProgress"],
    queryFn: () => getWaterApi(token),
    enabled: !!token,
  });

  const updateWater = useMutation({
    mutationFn: ({ id, water }: { id: string; water: number }) =>
      updateWaterApi(id, water, token),
    onSuccess: () =>queryClient.invalidateQueries({ queryKey: ["WaterProgress"] }),
  });
  const today = WaterProgress?.today;
  const history = WaterProgress?.history ?? [];

  return { 
    WaterProgress, 
    today,
    history,
    Loadingwater, 
    updateWater 
  };
}


// const today = WaterProgress?.today;
// const history = WaterProgress?.history ?? [];
  // totalwater: today?.water ?? 0,
  // metawt: today?.goal ?? 0,
  // atingiumetawt: today?.achieved ?? false,
  // porcentagemwt: today?.percentage ?? 0,