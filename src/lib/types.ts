export type Priority = "Alta" | "Média" | "Baixa";
export type TaskStatus = "pendente" | "em-progresso" | "concluída";

export interface FileAttachment {
  id: string;
  name: string;
  url: string; // Placeholder for file URL
  size: number; // In bytes
  type: string; // Mime type
}

export interface Subtask {
  id: string;
  name: string;
  priority: Priority;
  deadline: string; // ISO date string
  estimatedTime?: string; // e.g., "2h", "30m"
  description?: string;
  status: TaskStatus;
  createdAt: string; // ISO date string
  attachments?: FileAttachment[];
}

export interface Task {
  id: string;
  name: string;
  priority: Priority;
  deadline: string; // ISO date string
  description?: string;
  status: TaskStatus;
  createdAt: string; // ISO date string
  subtasks: Subtask[];
  attachments?: FileAttachment[];
}

export interface ProductivityReportParams {
  userId: string; // Mocked, will be from auth
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
