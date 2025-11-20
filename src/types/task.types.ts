export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  user: string;
  category?: string | null;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: 'pending' | 'in-progress' | 'completed';
  category?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  category?: string | null;
}
