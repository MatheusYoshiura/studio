"use client";

import type { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight, CalendarClock } from "lucide-react";

interface UpcomingTasksProps {
  tasks: Partial<Task>[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-foreground/70 text-center py-4">Nenhuma tarefa futura para exibir.</p>;
  }

  const getPriorityBadgeVariant = (priority: string | undefined) => {
    switch (priority) {
      case "Alta":
        return "destructive";
      case "Média":
        return "secondary";
      case "Baixa":
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = parseISO(dateString);
    const diff = differenceInDays(date, new Date());
    if (diff < 0) return `Atrasada (${format(date, "dd MMM", { locale: ptBR })})`;
    if (diff === 0) return `Hoje (${format(date, "HH:mm", { locale: ptBR })})`;
    if (diff === 1) return `Amanhã (${format(date, "HH:mm", { locale: ptBR })})`;
    return format(date, "dd MMM, HH:mm", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg hover:bg-card-foreground/10 transition-colors">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">{task.name}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarClock className="w-3.5 h-3.5" />
              <span>{formatDate(task.deadline)}</span>
              {task.priority && (
                <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs px-1.5 py-0.5">
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
            <Link href={`/tasks#${task.id}`}>Ver <ArrowRight className="w-4 h-4 ml-1"/></Link>
          </Button>
        </div>
      ))}
      {tasks.length > 0 && (
         <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/tasks">Ver Todas as Tarefas</Link>
        </Button>
      )}
    </div>
  );
}
