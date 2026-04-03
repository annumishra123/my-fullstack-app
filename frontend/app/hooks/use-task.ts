import type { CreateTaskFormData } from "@/components/ui/task/create-task-dialog";
import {fetchData, posData, updateData} from "@/lib/fetch-util";
import type { TaskStatus, TaskPriority } from "@/types";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import type { title } from "process";
import type { text } from "stream/consumers";


export const useCreateTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {projectId: string; taskData: CreateTaskFormData}) => {
            posData(`/tasks/${data.projectId}/create-task`, data.taskData);
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["project", data.projectId] });
        },
    });
}



export const useTaskByIdQuery = (taskId: string) => {
   return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchData(`/tasks/${taskId}`),
   })
}


export const useUpdateTaskTitleMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string; title: string }) =>
        updateData(`/tasks/${data.taskId}/title`, { title: data.title }),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["task", data._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data._id],
        });
      },
    });
  };


  export const useUpdateTaskStatusMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string; status: TaskStatus }) =>
        updateData(`/tasks/${data.taskId}/status`, { title: data.status }),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["task", data._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data._id],
        });
      },
    });
  };


  export const useUpdateTaskDescriptionMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string; description: string }) =>
        updateData(`/tasks/${data.taskId}/description`, {
          description: data.description,
        }),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["task", data._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data._id],
        });
      },
    });
  };




  export const useUpdateTaskAssigneesMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string; assignees: string[] }) =>
        updateData(`/tasks/${data.taskId}/assignees`, {
          assignees: data.assignees,
        }),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["task", data._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data._id],
        });
      },
    });
  };



  export const useUpdateTaskPriorityMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string; priority: TaskPriority }) =>
        updateData(`/tasks/${data.taskId}/priority`, { priority: data.priority }),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["task", data._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data._id],
        });
      },
    });
  };




  export const useAddSubTaskMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string; title: string }) =>
        posData(`/tasks/${data.taskId}/add-subtask`, { title: data.title }),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["task", data._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data._id],
        });
      },
    });
  };


  export const useUpdateSubTaskMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string; subTaskId: string, completed: boolean }) =>
        updateData(`/tasks/${data.taskId}/update-subtask/${data.subTaskId}`, { completed: data.completed }),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["task", data._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data._id],
        })
      },
    });
  };



  export const useAddCommentMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string; text: string }) =>
        posData(`/tasks/${data.taskId}/add-comment`, { text: data.text }),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["comments", data.task],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data.task],
        });
      },
    });
  };



  export const useGetCommentsByTaskIdQuery = (taskId: string) => {
    return useQuery({
      queryKey: ["comment", taskId],
      queryFn: () => fetchData(`/tasks/${taskId}/comments`),
    });
  };


  export const useWatchTaskMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string }) =>
        posData(`/tasks/${data.taskId}/watch`, {}),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["task", data._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data._id],
        });
      },
    });
  };
  
  export const useAchievedTaskMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: { taskId: string }) =>
        posData(`/tasks/${data.taskId}/achieved`, {}),
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["task", data._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", data._id],
        });
      },
    });
  };

  export const useGetMyTasksQuery = () => {
    return useQuery({
      queryKey: ["my-tasks", "user"],
      queryFn: () => fetchData(`/tasks/my-tasks`),
    });
  };