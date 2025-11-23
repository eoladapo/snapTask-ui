export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  user: string;
  category?: string | null;
  taskDate?: string; // ISO date string for which day this task belongs to
  createdAt?: string; // ISO date string for when task was created
  updatedAt?: string; // ISO date string for when task was last updated
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
