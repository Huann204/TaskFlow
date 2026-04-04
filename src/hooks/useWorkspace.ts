import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { type Team } from "@/types";

export function useWorkspace() {
  const queryClient = useQueryClient();

  // Fetch all workspaces user belongs to
  const {
    data: workspaces,
    isLoading,
    error,
    refetch,
  } = useQuery<Team[]>({
    queryKey: ["workspaces"],
    queryFn: () => apiRequest("/team/workspaces"),
  });

  const { data: activeWorkspaceId } = useQuery<string | null>({
     queryKey: ["activeWorkspaceId"],
     queryFn: () => {
        if (typeof window !== "undefined") {
           return localStorage.getItem("taskflow_active_workspace") || null;
        }
        return null;
     },
     staleTime: Infinity,
  });

  // Sync with localStorage & select default if none active
  useEffect(() => {
    if (!workspaces || workspaces.length === 0) return;

    const storedId = activeWorkspaceId || localStorage.getItem("taskflow_active_workspace");

    // Check if stored workspace actually exists in fetched list
    const validStored = storedId && workspaces.some((w) => w.id === storedId);

    if (validStored && !activeWorkspaceId) {
      queryClient.setQueryData(["activeWorkspaceId"], storedId);
    } else if (!validStored) {
      // Default to personal workspace (should always be first per backend sort)
      const personal =
        workspaces.find((w) => w.type === "personal") || workspaces[0];
      if (personal) {
        queryClient.setQueryData(["activeWorkspaceId"], personal.id);
        localStorage.setItem("taskflow_active_workspace", personal.id);
      }
    }
  }, [workspaces, activeWorkspaceId, queryClient]);

  const setWorkspace = (id: string) => {
    queryClient.setQueryData(["activeWorkspaceId"], id);
    localStorage.setItem("taskflow_active_workspace", id);
  };

  const activeWorkspace =
    workspaces?.find((w) => w.id === activeWorkspaceId) || null;

  return {
    workspaces: workspaces || [],
    activeWorkspace,
    activeWorkspaceId: activeWorkspaceId || null,
    setWorkspace,
    isLoading,
    error,
    refetch,
  };
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; type: "personal" | "team" }) =>
      apiRequest(`/team`, {
        method: "POST",
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/team/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.setQueryData(["activeWorkspaceId"], null); // Clear if deleted
      return queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; type?: "personal" | "team" } }) =>
      apiRequest(`/team/${id}`, {
        method: "PATCH",
        data,
      }),
    onSuccess: (_, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
        queryClient.invalidateQueries({ queryKey: ["team", variables.id] }),
      ]);
    },
  });
}
