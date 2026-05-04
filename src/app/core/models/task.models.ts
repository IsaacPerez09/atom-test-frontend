export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface PaginatedTasks {
  tasks: Task[];
  hasMore: boolean;
}
