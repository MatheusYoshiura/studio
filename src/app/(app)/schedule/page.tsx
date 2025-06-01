"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Task } from "@/lib/types";
import { format, parseISO, isToday, isThisWeek, isThisMonth, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image'; // For placeholder image

// Mock data, same as tasks page for consistency
const mockTasks: Task[] = [
   {
    id: "1", name: "Desenvolver Landing Page", priority: "Alta", deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), status: "em-progresso", createdAt: new Date().toISOString(), subtasks: [],
    description: "Finalizar o desenvolvimento da landing page com todos os CTAs."
  },
  {
    id: "2", name: "Reunião de Alinhamento", priority: "Média", deadline: new Date().toISOString(), status: "pendente", createdAt: new Date().toISOString(), subtasks: [],
    description: "Reunião com a equipe para alinhar próximos passos do projeto X."
  },
  {
    id: "3", name: "Testar API de Pagamentos", priority: "Alta", deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: "pendente", createdAt: new Date().toISOString(), subtasks: [],
  },
  {
    id: "4", name: "Planejar Sprint Q3", priority: "Média", deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), status: "pendente", createdAt: new Date().toISOString(), subtasks: [],
  },
   {
    id: "5", name: "Corrigir Bugs da v1.2", priority: "Baixa", deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), status: "concluída", createdAt: new Date().toISOString(), subtasks: [],
  },
];


const TaskCard = ({ task }: { task: Task }) => {
  const getPriorityBadgeVariant = (priority: string | undefined) => {
    switch (priority) {
      case "Alta": return "destructive";
      case "Média": return "secondary";
      case "Baixa": default: return "outline";
    }
  };
  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md font-semibold">{task.name}</CardTitle>
          <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">{task.priority}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Prazo: {format(parseISO(task.deadline), "dd MMM, HH:mm", { locale: ptBR })}
        </p>
      </CardHeader>
      {task.description && (
        <CardContent className="px-4 pb-3">
          <p className="text-sm text-foreground/80">{task.description}</p>
        </CardContent>
      )}
    </Card>
  );
};

const TasksForPeriod = ({ tasks, title }: { tasks: Task[]; title: string }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
    {tasks.length > 0 ? (
      tasks.map(task => <TaskCard key={task.id} task={task} />)
    ) : (
      <p className="text-muted-foreground text-sm">Nenhuma tarefa para este período.</p>
    )}
  </div>
);


export default function SchedulePage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const todayTasks = tasks.filter(task => isToday(parseISO(task.deadline)));
  const thisWeekTasks = tasks.filter(task => isThisWeek(parseISO(task.deadline), { weekStartsOn: 1 }));
  const thisMonthTasks = tasks.filter(task => isThisMonth(parseISO(task.deadline)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold text-foreground flex items-center">
          <Calendar className="mr-3 h-8 w-8 text-primary" /> Cronograma
        </h1>
        {/* Add filters or view switchers here if needed */}
      </div>

      <Tabs defaultValue="hoje" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4">
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="semana">Esta Semana</TabsTrigger>
          <TabsTrigger value="mes">Este Mês</TabsTrigger>
        </TabsList>
        <TabsContent value="hoje">
          <TasksForPeriod tasks={todayTasks} title="Tarefas para Hoje" />
        </TabsContent>
        <TabsContent value="semana">
          <TasksForPeriod tasks={thisWeekTasks} title="Tarefas para Esta Semana" />
        </TabsContent>
        <TabsContent value="mes">
          <TasksForPeriod tasks={thisMonthTasks} title="Tarefas para Este Mês" />
        </TabsContent>
      </Tabs>
      
      <Card data-ai-hint="calendar schedule">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Visualização do Calendário (Em breve)</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p className="mb-4">Uma visualização de calendário mais interativa será adicionada aqui.</p>
          <div className="max-w-md mx-auto bg-muted p-4 rounded-md">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Placeholder de calendário" 
              width={600} 
              height={400}
              className="rounded-md shadow-md"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
