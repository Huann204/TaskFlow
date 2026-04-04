import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Team, TeamRole } from "@/types";

export function useTeam(teamId: string | null) {
  return useQuery<Team>({
    queryKey: ["team", teamId],
    queryFn: () => apiRequest(`/team/${teamId}`),
    enabled: !!teamId,
  });
}

export function useInviteMember(teamId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; role: TeamRole }) =>
      apiRequest(`/team/${teamId}/invite`, {
        method: 'POST',
        data,
      }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["team", teamId] }),
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
      ]);
    },
  });
}

export function useUpdateMember(teamId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      role,
      status,
    }: {
      memberId: string;
      role?: TeamRole;
      status?: "active" | "pending";
    }) =>
      apiRequest(`/team/${teamId}/members/${memberId}`, {
        method: "PATCH",
        data: { role, status },
      }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["team", teamId] }),
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
      ]);
    },
  });
}

export function useRemoveMember(teamId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      apiRequest(`/team/${teamId}/members/${memberId}`, { method: "DELETE" }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["team", teamId] }),
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
      ]);
    },
  });
}

export function useUpdateTeam(teamId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) =>
      apiRequest(`/team/${teamId}`, {
        method: "PATCH",
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useInvitations() {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: () => apiRequest("/team/invitations"),
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) =>
      apiRequest(`/team/${teamId}/accept`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useDeclineInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) =>
      apiRequest(`/team/${teamId}/decline`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}
