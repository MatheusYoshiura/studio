
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Task, Priority } from "@/lib/types";
import { format, parseISO, isToday, isThisWeek, isThisMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIconLucide, ListFilter, Loader2 } from "lucide-react"; // Renamed to avoid conflict
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar"; // react-day-picker based calendar
import { useTasks } from "@/contexts/TaskContext";

const TaskCard = ({ task }: { task: Task }) => {
  const [formattedDeadline, setFormattedDeadline] = useState<string | null>(null);

  useEffect(() => {
    if (task.deadline) {
      setFormattedDeadline(format(parseISO(task.deadline), "dd MMM, HH:mm", { locale: ptBR }));
    }
  }, [task.deadline]);

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
          Prazo: {formattedDeadline || "Carregando..."}
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
  const { tasks, isLoadingTasks } = useTasks();
  
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [thisWeekTasks, setThisWeekTasks] = useState<Task[]>([]);
  const [thisMonthTasks, setThisMonthTasks] = useState<Task[]>([]);

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(new Date());
  const [tasksForSelectedDay, setTasksForSelectedDay] = useState<Task[]>([]);

  useEffect(() => {
    if (!isLoadingTasks && tasks) {
      setTodayTasks(tasks.filter(task => task.deadline && isToday(parseISO(task.deadline))));
      setThisWeekTasks(tasks.filter(task => task.deadline && isThisWeek(parseISO(task.deadline), { weekStartsOn: 1 })));
      setThisMonthTasks(tasks.filter(task => task.deadline && isThisMonth(parseISO(task.deadline))));
    }
  }, [tasks, isLoadingTasks]);

  useEffect(() => {
    if (selectedCalendarDate && tasks) {
      const tasksOnSelectedDate = tasks.filter(task =>
        task.deadline && isSameDay(parseISO(task.deadline), selectedCalendarDate)
      );
      setTasksForSelectedDay(tasksOnSelectedDate.sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()));
    } else {
      setTasksForSelectedDay([]);
    }
  }, [selectedCalendarDate, tasks]);

  const taskDeadlineDates = useMemo(() =>
    tasks.map(task => task.deadline ? parseISO(task.deadline) : null).filter(Boolean) as Date[]
  , [tasks]);

  const calendarModifiers = {
    hasTasks: taskDeadlineDates,
  };
  const calendarModifiersClassNames = {
    hasTasks: 'rdp-day_hasTask',
  };

  const getPriorityBadgeVariantPage = (priority: Priority | string | undefined) => {
    switch (priority) {
      case "Alta": return "destructive";
      case "Média": return "secondary";
      case "Baixa": default: return "outline";
    }
  };

  if (isLoadingTasks) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        <span className="text-lg text-muted-foreground">Carregando cronograma...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold text-foreground flex items-center">
          <CalendarIconLucide className="mr-3 h-8 w-8 text-primary" /> Cronograma
        </h1>
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
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Calendário Interativo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="flex justify-center md:justify-start">
              <Calendar
                mode="single"
                selected={selectedCalendarDate}
                onSelect={setSelectedCalendarDate}
                modifiers={calendarModifiers}
                modifiersClassNames={calendarModifiersClassNames}
                className="rounded-md border shadow-sm bg-card p-3"
                locale={ptBR}
                weekStartsOn={1} // Monday
              />
            </div>
            <div className="mt-4 md:mt-0">
              {selectedCalendarDate ? (
                <>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    Tarefas para {format(selectedCalendarDate, "PPP", { locale: ptBR })}
                  </h3>
                  {tasksForSelectedDay.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {tasksForSelectedDay.map(task => (
                        <div key={task.id} className="p-3 bg-muted/30 rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-medium text-foreground text-sm">{task.name}</h4>
                            {task.priority && (
                              <Badge variant={getPriorityBadgeVariantPage(task.priority)} className="text-xs px-1.5 py-0.5 shrink-0">
                                {task.priority}
                              </Badge>
                            )}
                          </div>
                          {task.deadline && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Horário: {format(parseISO(task.deadline), "HH:mm", { locale: ptBR })}
                            </p>
                          )}
                          {task.description && (
                              <p className="text-xs text-foreground/80 mt-1">{task.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma tarefa para esta data.</p>
                  )}
                </>
              ) : (
                 <p className="text-muted-foreground text-center md:text-left pt-4">Selecione uma data no calendário para ver as tarefas.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
