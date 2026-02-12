import type { WorkspaceForm } from "@/components/ui/workspace/create-workspace";
import { fetchData, posData } from "@/lib/fetch-util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) => posData("/workspace/createWorkspace", data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchData("/workspace"),
  });
};


export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => fetchData(`/workspace/${workspaceId}/projects`),
  });
};
