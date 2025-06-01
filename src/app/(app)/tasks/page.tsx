
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Task, Subtask, Priority, TaskStatus, FileAttachment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { PlusCircle, Search, Filter, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTasks } from "@/contexts/TaskContext";


export default function TasksPage() {
  const {
    tasks,
    addTask,
    editTask,
    deleteTask,
    toggleTaskStatus,
    addSubtask,
    editSubtask,
    deleteSubtask,
    isLoadingTasks, 
  } = useTasks();

  const router = useRouter();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (searchParams.get("openNewTask") === "true") {
      setEditingTask(null); // Ensure we are not editing
      setIsFormOpen(true);
      // Clean the URL
      const newPath = window.location.pathname; // or "/tasks"
      router.replace(newPath, undefined);
    }
  }, [searchParams, router]);


  const handleSaveTask = (taskData: Omit<Task, "id" | "createdAt"> | Task) => {
    if ("id" in taskData && taskData.id) { 
      editTask(taskData as Task);
    } else { 
      // Ensure subtasks and attachments are initialized if not present for new tasks
      const newTaskData = {
        ...taskData,
        subtasks: taskData.subtasks || [],
        attachments: taskData.attachments || [],
      } as Omit<Task, "id" | "createdAt">;
      addTask(newTaskData);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleEditTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  
  const handleDeleteTaskClick = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleToggleTaskStatusClick = (taskId: string, currentStatus: TaskStatus) => {
    toggleTaskStatus(taskId, currentStatus);
  };
  
  const handleAddSubtaskClick = (parentId: string, subtaskData: Omit<Subtask, "id" | "createdAt">) => {
    addSubtask(parentId, subtaskData);
  };

  const handleDeleteSubtaskClick = (parentId: string, subtaskId: string) => {
    deleteSubtask(parentId, subtaskId);
  };

  const handleEditSubtaskClick = (parentId: string, subtaskData: Subtask) => {
     editSubtask(parentId, subtaskData);
  };

  const filteredTasks = tasks.filter(task => {
    const searchMatch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch = statusFilter[task.status];
    
    const priorityMatch = task.priority ? priorityFilter[task.priority] : true;
    return searchMatch && statusMatch && priorityMatch;
  });
  
  if (isLoadingTasks) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        <span className="text-lg text-muted-foreground">Carregando tarefas...</span>
      </div>
    );
  }

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
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1).replace("-"," ")}
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
        onEditTask={handleEditTaskClick} 
        onDeleteTask={handleDeleteTaskClick} 
        onToggleTaskStatus={handleToggleTaskStatusClick} 
        onAddSubtask={handleAddSubtaskClick} 
        onDeleteSubtask={handleDeleteSubtaskClick} 
        onEditSubtask={handleEditSubtaskClick} 
      />
    </div>
  );
}
