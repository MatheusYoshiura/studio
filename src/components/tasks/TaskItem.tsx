"use client";

import type { Task, Subtask, Priority, TaskStatus, FileAttachment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, MoreVertical, CheckCircle, Circle, Zap, Paperclip, FileText, Plus, X } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from "react";
import { SubtaskForm } from "./SubtaskForm"; // Assuming SubtaskForm exists
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUploadPlaceholder } from "../shared/FileUploadPlaceholder";
import { Progress } from "@/components/ui/progress";
import Image from 'next/image';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onAddSubtask: (parentId: string, subtaskData: Omit<Subtask, "id" | "createdAt">) => void;
  onDeleteSubtask: (parentId: string, subtaskId: string) => void;
  onEditSubtask: (parentId: string, subtaskData: Subtask) => void;
}

export function TaskItem({ task, onEdit, onDelete, onToggleStatus, onAddSubtask, onDeleteSubtask, onEditSubtask }: TaskItemProps) {
  const [isSubtaskFormOpen, setIsSubtaskFormOpen] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);

  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case "Alta": return "border-red-500/50 bg-red-500/10 text-red-400";
      case "Média": return "border-yellow-500/50 bg-yellow-500/10 text-yellow-400";
      case "Baixa": return "border-green-500/50 bg-green-500/10 text-green-400";
      default: return "border-border bg-card";
    }
  };
  
  const getStatusIcon = (status: TaskStatus) => {
    if (status === "concluída") return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === "em-progresso") return <Zap className="h-5 w-5 text-blue-500 animate-pulse" />;
    return <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  const handleSaveSubtask = (subtaskData: Omit<Subtask, "id" | "createdAt"> | Subtask) => {
    if (editingSubtask && "id" in subtaskData) {
      onEditSubtask(task.id, subtaskData as Subtask);
    } else {
      onAddSubtask(task.id, subtaskData as Omit<Subtask, "id" | "createdAt">);
    }
    setIsSubtaskFormOpen(false);
    setEditingSubtask(null);
  };

  const handleEditSubtaskClick = (subtask: Subtask) => {
    setEditingSubtask(subtask);
    setIsSubtaskFormOpen(true);
  };

  const subtasksCompleted = task.subtasks.filter(st => st.status === "concluída").length;
  const subtasksTotal = task.subtasks.length;
  const progress = subtasksTotal > 0 ? (subtasksCompleted / subtasksTotal) * 100 : (task.status === "concluída" ? 100 : (task.status === "em-progresso" ? 50 : 0));


  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 ${getPriorityClass(task.priority)}`}>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center gap-3">
           <Button variant="ghost" size="icon" onClick={onToggleStatus} className="h-8 w-8 shrink-0">
            {getStatusIcon(task.status)}
          </Button>
          <div>
            <CardTitle className={`font-headline text-lg ${task.status === 'concluída' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Criada em: {format(parseISO(task.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}><Edit2 className="mr-2 h-4 w-4" /> Editar Tarefa</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir Tarefa
            </DropdownMenuItem>
             <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setEditingSubtask(null); setIsSubtaskFormOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Subtarefa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        {task.description && (
          <p className="text-sm text-foreground/80">{task.description}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <Badge variant={task.priority === "Alta" ? "destructive" : task.priority === "Média" ? "secondary" : "outline"} className="capitalize">{task.priority}</Badge>
          <span className="text-muted-foreground">
            Prazo: {format(parseISO(task.deadline), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
        
        {task.attachments && task.attachments.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Anexos:</h4>
            <div className="flex flex-wrap gap-2">
              {task.attachments.map(file => (
                <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded-md flex items-center gap-1 transition-colors">
                  <Paperclip className="h-3 w-3"/> {file.name}
                </a>
              ))}
            </div>
          </div>
        )}
         <div className="pt-2"> {/* Placeholder for adding attachments */}
            <FileUploadPlaceholder onFileUpload={(file) => console.log("File to upload:", file.name)} small />
        </div>


        {task.subtasks && task.subtasks.length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-foreground mb-2">Subtarefas ({subtasksCompleted}/{subtasksTotal}):</h4>
            <Progress value={progress} className="h-2 mb-2" />
            <ul className="space-y-2 pl-2 border-l-2 border-border ml-2">
              {task.subtasks.map(subtask => (
                <li key={subtask.id} className="flex items-center justify-between group text-sm">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEditSubtask(task.id, {...subtask, status: subtask.status === "concluída" ? "pendente" : "concluída" })}>
                      {subtask.status === "concluída" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <span className={`${subtask.status === "concluída" ? "line-through text-muted-foreground" : "text-foreground/90"}`}>
                      {subtask.name} <Badge variant="outline" className="ml-1 text-xs">{subtask.priority}</Badge>
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditSubtaskClick(subtask)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={() => onDeleteSubtask(task.id, subtask.id)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <Dialog open={isSubtaskFormOpen} onOpenChange={(isOpen) => { setIsSubtaskFormOpen(isOpen); if(!isOpen) setEditingSubtask(null);}}>
        <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">
              {editingSubtask ? "Editar Subtarefa" : "Adicionar Nova Subtarefa"}
            </DialogTitle>
          </DialogHeader>
          <SubtaskForm
            onSave={handleSaveSubtask}
            initialData={editingSubtask}
            onClose={() => { setIsSubtaskFormOpen(false); setEditingSubtask(null); }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
