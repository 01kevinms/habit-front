import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../services/AuthContext";
import { getStatusApi, createStatus, deleteStatusApi } from "../services/api";
import type { NewStatus, Status } from "../types/manytypes";

export function useStatusPhysical() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Busca todos os status físicos do usuário
  const { data, isLoading } = useQuery<Status[]>({
    queryKey: ["status"],
    queryFn: () => getStatusApi(token!),
    enabled: !!token,
  });

  // Garante que 'status' sempre seja um array
  const status = data ?? [];

  // Cria um novo status físico
  const createStatush = useMutation({
    mutationFn: (newStatus: NewStatus) => createStatus(newStatus, token!),
    onSuccess: () => {
      // Atualiza os dados após criar um novo status
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
    onError: (error) => {
      console.error("Erro ao criar status físico:", error);
    },
  });
   const deleteStatus = useMutation({
      mutationFn: (id: string) => deleteStatusApi(id, token!),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["status"] }),
    });

  return { status, isLoading, createStatush,deleteStatus };
}
