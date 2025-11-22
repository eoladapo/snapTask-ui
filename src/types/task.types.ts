export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  user: string;
  category?: string | null;
  taskDate?: string; // ISO date string for which day this task belongs to
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: 'pending' | 'in-progress' | 'completed';
  category?: string | null;
  taskDate?: string; // ISO date string
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  category?: string | null;
  taskDate?: string; // ISO date string
}
