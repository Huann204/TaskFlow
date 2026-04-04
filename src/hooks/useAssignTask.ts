import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Task } from "@/types";

export function useAssignTask(workspaceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      assignedTo,
    }: {
      taskId: string;
      assignedTo: string | null;
    }) =>
      apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        data: { assignedTo },
      }),

    // Optimistic update
    onMutate: async ({ taskId, assignedTo }) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assignedTo: assignedTo
                  ? { id: assignedTo, name: "...", email: "" }
                  : null,
              }
            : t
        )
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      const queryKey = ["tasks", workspaceId];
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}
