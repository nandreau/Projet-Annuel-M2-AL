export interface User extends WithTimestamps {
  id: number;
  firstname: string;
  name: string;
  email: string;
  roles: Role[];
  job: string[];
  avatar?: string;
  password?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Assignment extends WithTimestamps {
  id: number;
  startDate: string;
  endDate: string;
  users: User[];
}

export interface Task extends WithTimestamps {
  id: number;
  name: string;
  done: boolean;
  dueDate?: string;
  doneDate?: string;
  images?: string[];
  assignments: Assignment[];
}

export interface Phase extends WithTimestamps {
  id: number;
  name: string;
  tasks: Task[];
}

export interface Chantier extends WithTimestamps {
  id: number;
  title: string;
  client: User;
  address: string;
  start: string;
  end: string;
  phases: Phase[];
  images?: string;
}

export interface ProblemMessage extends WithTimestamps {
  id: number;
  user: User;
  content: string;
}

export interface Problem extends WithTimestamps {
  id: number;
  title: string;
  urgency: 'Urgent' | 'Moyen' | 'Faible';
  chantier: string;
  phase: string;
  task: string;
  status: 'En cours' | 'Non résolu' | 'Résolu';
  description: string;
  user: User;
  images: string[];
  problem_messages: ProblemMessage[];
}

export interface WithTimestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  id: number;
  firstname: string;
  name: string;
  email: string;
  roles: string[];
  avatar: string | null;
  accessToken: string;
}

export interface ApiResponse {
  message: string;
}

export type FieldType = 'text' | 'email' | 'password' | 'multiselect' | 'chips' | 'date' | 'select';

export interface FormField<T = any> {
  key: keyof T;
  label: string;
  type: FieldType;
  options?: any[];
  optionValue?: string;
  optionLabel?: string;
  placeholder?: string;
}