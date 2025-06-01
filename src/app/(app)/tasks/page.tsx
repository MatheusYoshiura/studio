
"use client";

import { useState, useEffect } from "react";
import type { Task, Subtask, Priority, TaskStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for demonstration - used as a fallback
const initialTasks: Task[] = [
  {
    id: "1",
    name: "Desenvolver Landing Page",
    priority: "Alta",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Criar a landing page principal com seções de features, pricing e CTA.",
    status: "em-progresso",
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: "s1-1", name: "Definir paleta de cores", priority: "Alta", deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), status: "concluída", createdAt: new Date().toISOString() },
      { id: "s1-2", name: "Criar wireframes", priority: "Média", deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), status: "pendente", createdAt: new Date().toISOString() },
    ],
    attachments: [{ id: "f1", name: "briefing.pdf", url: "#", size: 102400, type: "application/pdf" }]
  },
  {
    id: "2",
    name: "Configurar Autenticação",
    priority: "Alta",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pendente",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [],
  },
  {
    id: "3",
    name: "Escrever Documentação da API",
    priority: "Média",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Documentar todos os endpoints da API para o time de frontend.",
    status: "pendente",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [],
  },
];

const LOCAL_STORAGE_KEY = "xmanager-tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Record<TaskStatus, boolean>>({
    pendente: true,
    "em-progresso": true,
    concluída: true,
  });
  const [priorityFilter, setPriorityFilter] = useState<Record<Priority, boolean>>({
    Alta: true,
    Média: true,
    Baixa: true,
  });
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(initialTasks); // Fallback to mock data if nothing in localStorage
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
      setTasks(initialTasks); // Fallback on error
    }
    setIsInitialLoadComplete(true);
  }, []);

  // Save tasks to localStorage whenever they change, after initial load
  useEffect(() => {
    if (isInitialLoadComplete) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage:", error);
      }
    }
  }, [tasks, isInitialLoadComplete]);


  const handleSaveTask = (taskData: Omit<Task, "id" | "createdAt" | "subtasks" | "attachments"> | Task) => {
    if ("id" in taskData && taskData.id) { // Editing existing task
      setTasks(prevTasks => prevTasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
    } else { // Adding new task
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: taskData.status || "pendente", // Default status if not provided
        subtasks: [],
        attachments: [],
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
  };

  const handleToggleTaskStatus = (taskId: string, currentStatus: TaskStatus) => {
    let nextStatus: TaskStatus;
    if (currentStatus === "pendente") nextStatus = "em-progresso";
    else if (currentStatus === "em-progresso") nextStatus = "concluída";
    else nextStatus = "pendente";
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
  };
  
  const handleAddSubtask = (parentId: string, subtaskData: Omit<Subtask, "id" | "createdAt">) => {
    const newSubtask: Subtask = {
      ...subtaskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: subtaskData.status || "pendente",
    };
    setTasks(prevTasks => prevTasks.map(t => t.id === parentId ? { ...t, subtasks: [...(t.subtasks || []), newSubtask] } : t));
  };

  const handleDeleteSubtask = (parentId: string, subtaskId: string) => {
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === parentId 
        ? { ...t, subtasks: (t.subtasks || []).filter(st => st.id !== subtaskId) } 
        : t
    ));
  };

  const handleEditSubtask = (parentId: string, subtaskData: Subtask) => {
     setTasks(prevTasks => prevTasks.map(t => 
      t.id === parentId 
        ? { ...t, subtasks: (t.subtasks || []).map(st => st.id === subtaskData.id ? subtaskData : st) } 
        : t
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const searchMatch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch = statusFilter[task.status];
    // Handle case where task.priority might not be in priorityFilter (e.g. if types change or data is inconsistent)
    const priorityMatch = task.priority ? priorityFilter[task.priority] : true;
    return searchMatch && statusMatch && priorityMatch;
  });
  

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Minhas Tarefas</h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingTask(null); }}>
          <DialogTrigger asChild>
            <Button className="font-headline bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">
                {editingTask ? "Editar Tarefa" : "Criar Nova Tarefa"}
              </DialogTitle>
            </DialogHeader>
            <TaskForm 
              onSave={handleSaveTask} 
              initialData={editingTask} 
              onClose={() => { setIsFormOpen(false); setEditingTask(null); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tarefas..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto shrink-0">
              <Filter className="mr-2 h-4 w-4" /> Filtrar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(statusFilter) as TaskStatus[]).map((statusKey) => (
              <DropdownMenuCheckboxItem
                key={statusKey}
                checked={statusFilter[statusKey]}
                onCheckedChange={(checked) =>
                  setStatusFilter(prev => ({ ...prev, [statusKey]: Boolean(checked) }))
                }
              >
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuLabel className="mt-2">Prioridade</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(priorityFilter) as Priority[]).map((priorityKey) => (
              <DropdownMenuCheckboxItem
                key={priorityKey}
                checked={priorityFilter[priorityKey]}
                onCheckedChange={(checked) =>
                  setPriorityFilter(prev => ({ ...prev, [priorityKey]: Boolean(checked) }))
                }
              >
                {priorityKey}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TaskList
        tasks={filteredTasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onToggleTaskStatus={handleToggleTaskStatus}
        onAddSubtask={handleAddSubtask}
        onDeleteSubtask={handleDeleteSubtask}
        onEditSubtask={handleEditSubtask}
      />
    </div>
  );
}

    