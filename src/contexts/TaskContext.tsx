
"use client";

import type { Task, Subtask, Priority, TaskStatus } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// Mock data for demonstration - used as a fallback if localStorage is empty
const initialTasksData: Task[] = [
  {
    id: "ctx-1",
    name: "Desenvolver Landing Page (Contexto)",
    priority: "Alta",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Criar a landing page principal com seções de features, pricing e CTA.",
    status: "em-progresso",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [
      { id: "ctx-s1-1", name: "Definir paleta de cores (Contexto)", priority: "Alta", deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), status: "concluída", createdAt: new Date().toISOString() },
      { id: "ctx-s1-2", name: "Criar wireframes (Contexto)", priority: "Média", deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), status: "pendente", createdAt: new Date().toISOString() },
    ],
    attachments: [{ id: "ctx-f1", name: "briefing_contexto.pdf", url: "#", size: 102400, type: "application/pdf" }]
  },
  {
    id: "ctx-2",
    name: "Configurar Autenticação (Contexto)",
    priority: "Alta",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pendente",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [],
  },
    {
    id: "ctx-3", name: "Reunião de Alinhamento (Contexto)", priority: "Média", deadline: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString(), status: "pendente", createdAt: new Date().toISOString(), subtasks: [],
    description: "Reunião com a equipe para alinhar próximos passos do projeto X (Contexto)."
  },
];

const LOCAL_STORAGE_KEY = "xmanager-tasks";

interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: Omit<Task, "id" | "createdAt" | "subtasks" | "attachments">) => void;
  editTask: (taskData: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string, currentStatus: TaskStatus) => void;
  addSubtask: (parentId: string, subtaskData: Omit<Subtask, "id" | "createdAt">) => void;
  editSubtask: (parentId: string, subtaskData: Subtask) => void;
  deleteSubtask: (parentId: string, subtaskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  isLoadingTasks: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    setIsLoadingTasks(true);
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(initialTasksData); 
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
      setTasks(initialTasksData); 
    }
    setIsLoadingTasks(false);
    setIsInitialLoadComplete(true);
  }, []);

  useEffect(() => {
    if (isInitialLoadComplete && !isLoadingTasks) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage:", error);
      }
    }
  }, [tasks, isInitialLoadComplete, isLoadingTasks]);

  const addTask = useCallback((taskData: Omit<Task, "id" | "createdAt" | "subtasks" | "attachments">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: taskData.status || "pendente",
      subtasks: [],
      attachments: [],
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  const editTask = useCallback((taskData: Task) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === taskData.id ? { ...taskData } : t));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
  }, []);

  const toggleTaskStatus = useCallback((taskId: string, currentStatus: TaskStatus) => {
    let nextStatus: TaskStatus;
    if (currentStatus === "pendente") nextStatus = "em-progresso";
    else if (currentStatus === "em-progresso") nextStatus = "concluída";
    else nextStatus = "pendente";
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
  }, []);

  const addSubtask = useCallback((parentId: string, subtaskData: Omit<Subtask, "id" | "createdAt">) => {
    const newSubtask: Subtask = {
      ...subtaskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: subtaskData.status || "pendente",
    };
    setTasks(prevTasks => prevTasks.map(t => t.id === parentId ? { ...t, subtasks: [...(t.subtasks || []), newSubtask] } : t));
  }, []);

  const editSubtask = useCallback((parentId: string, subtaskData: Subtask) => {
    setTasks(prevTasks => prevTasks.map(t =>
      t.id === parentId
        ? { ...t, subtasks: (t.subtasks || []).map(st => st.id === subtaskData.id ? subtaskData : st) }
        : t
    ));
  }, []);

  const deleteSubtask = useCallback((parentId: string, subtaskId: string) => {
    setTasks(prevTasks => prevTasks.map(t =>
      t.id === parentId
        ? { ...t, subtasks: (t.subtasks || []).filter(st => st.id !== subtaskId) }
        : t
    ));
  }, []);

  const getTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      editTask,
      deleteTask,
      toggleTaskStatus,
      addSubtask,
      editSubtask,
      deleteSubtask,
      getTaskById,
      isLoadingTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

    