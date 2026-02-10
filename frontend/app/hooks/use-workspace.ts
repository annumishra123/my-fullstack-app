import type { WorkspaceForm } from "@/components/ui/workspace/create-workspace";
import { fetchData, posData } from "@/lib/fetch-util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) => posData("/workspaces", data),
  });
};

