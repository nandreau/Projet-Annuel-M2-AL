export interface User extends WithTimestamps  {
  id: number;
  firstname: string;
  name: string;
  email: string;
  role: string[];
  job: string[];
  avatar?: string;
  password?: string;
}

export interface Assignment extends WithTimestamps  {
  id: number;
  startDate?: string;
  endDate?: string;
  attribution?: User[];
}

export interface Task extends WithTimestamps  {
  id: number;
  name: string;
  done: boolean;
  dueDate?: string;
  doneDate?: string;
  images?: string[];
  tasks: Assignment[];
}

export interface Phase extends WithTimestamps  {
  id: number;
  name: string;
  progress: number;
  tasks: Task[];
}

export interface Chantier extends WithTimestamps  {
  id: number;
  title: string;
  client: User;
  address: string;
  start: string;
  end: string;
  progress: number;
  phases: Phase[];
  images?: string[];
  intervenants: { avatar: string }[];
}

export interface ProblemMessage extends WithTimestamps  {
  id: number;
  user: User;
  content: string;
}

export interface Problem extends WithTimestamps  {
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
  messages: ProblemMessage[];
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
  avatar: string|null;
  accessToken: string;
}

export interface ApiResponse {
  message: string;
}
