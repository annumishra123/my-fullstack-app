import type { WorkspaceForm } from "@/components/ui/workspace/create-workspace";
import { fetchData, posData } from "@/lib/fetch-util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) => posData("/workspaces/createWorkspace", data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspace"],
    queryFn: async () => fetchData("/workspaces"),
  });
};


export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
  });
};


export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
  });
};


export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}`),
  });
};


export const useInviteMemberMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; role: string; workspaceId: string }) =>
      posData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};



export const useAcceptInviteByTokenMutation = () => { 
  return useMutation({
    mutationFn: (token: string) =>
      posData(`/workspaces/accept-invite-token`, {token}),
  });
};



export const useAcceptGenerateInviteMutation = () => { 
  return useMutation({
    mutationFn: (workspaceId: string) =>
      posData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};