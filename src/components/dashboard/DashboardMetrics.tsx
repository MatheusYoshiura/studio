
"use client";

import type { Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ListTodo, AlertTriangle, Hourglass } from "lucide-react";

interface DashboardMetricsProps {
  tasks: Task[]; 
}

export function DashboardMetrics({ tasks }: DashboardMetricsProps) {
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === "pendente").length;
  const completedTasks = tasks.filter(task => task.status === "concluída").length;
  const overdueTasks = tasks.filter(task => task.deadline && new Date(task.deadline) < new Date() && task.status !== "concluída").length;

  const metrics = [
    { title: "Total de Tarefas", value: totalTasks, icon: ListTodo, color: "text-primary" },
    { title: "Pendentes", value: pendingTasks, icon: Hourglass, color: "text-yellow-400" },
    { title: "Concluídas", value: completedTasks, icon: CheckCircle2, color: "text-green-400" },
    { title: "Atrasadas", value: overdueTasks, icon: AlertTriangle, color: "text-red-400" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground/80">{metric.title}</CardTitle>
            <metric.icon className={`h-5 w-5 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${metric.color}`}>{metric.value}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

    