export interface User {
  id: number;
  firstname: string;
  name: string;
  mail: string;
  date: string;
  role: string[];
  droit: string;
  avatar?: string;
  password?: string;
}

export interface TaskPlanning {
  id: number;
  startDate?: string;
  endDate?: string;
  attribution?: User[];
}

export interface Task {
  id: number;
  name: string;
  done: boolean;
  dueDate?: string;
  doneDate?: string;
  images?: string[];
  tasks: TaskPlanning[];
}

export interface Phase {
  id: number;
  name: string;
  progress: number;
  tasks: Task[];
}

export interface Chantier {
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

export interface ProblemMessage {
  id: number;
  sender: User;
  date: string;
  content: string;
}

export interface Problem {
  id: number;
  title: string;
  urgency: 'Urgent' | 'Moyen' | 'Faible';
  chantier: string;
  phase: string;
  task: string;
  date: string;
  status: 'En cours' | 'Non résolu' | 'Résolu';
  description: string;
  user: User;
  images: string[];
  messages: ProblemMessage[];
}
