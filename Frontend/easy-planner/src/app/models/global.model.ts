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

export interface UserAuth extends WithTimestamps {
  id: number;
  accessToken: string;
  avatar?: string;
  email: string;
  firstname: string;
  name: string;
  refreshToken: string;
  roles: RoleEnum[]
}

export enum RoleEnum {
  ROLE_CLIENT    = 'ROLE_CLIENT',
  ROLE_ARTISAN   = 'ROLE_ARTISAN',
  ROLE_MODERATOR = 'ROLE_MODERATOR',
  ROLE_ADMIN     = 'ROLE_ADMIN'
}

export interface Assignment extends WithTimestamps {
  id: number;
  taskId: number;
  startDate: string;
  endDate: string;
  users: User[];
}

export interface Task extends WithTimestamps {
  id: number;
  name: string;
  description: string;
  priority: 'Urgent' | 'Important' | 'Moyen' | 'Faible';
  done: boolean;
  dueDate?: string;
  doneDate?: string;
  images?: string[];
  assignments: Assignment[];
  checklists: Checklist[];
  phaseId: number;
}

export interface Checklist extends WithTimestamps {
  id: number;
  name: string;
  done: boolean;
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
  intervenants: User[];
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
  images?: string[]
  problemId: number
}

export interface Problem extends WithTimestamps {
  id: number;
  title: string;
  priority: 'Urgent' | 'Important' | 'Moyen' | 'Faible';
  chantier: Chantier;
  phaseLabel: string;
  taskLabel: string;
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
  data: any;
}

export type FieldType = 'text' | 'number' | 'time' | 'email' | 'password' | 'multiselect' | 'chips' | 'date' | 'select';

export interface FormField<T = any> {
  key: keyof T;
  label: string;
  type: FieldType;
  options?: any[];
  optionValue?: string;
  optionLabel?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}