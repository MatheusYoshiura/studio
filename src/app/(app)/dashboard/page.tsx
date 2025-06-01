
"use client"; 

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, Zap, Loader2 } from "lucide-react";
import { useTasks } from "@/contexts/TaskContext"; 


export default function DashboardPage() {
  const { tasks, isLoadingTasks } = useTasks(); 
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // ⌘ + K or Ctrl + K for Command Palette
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        console.log("Atalho ⌘/Ctrl + K pressionado (Abrir Comando - Placeholder)");
        // Aqui você adicionaria a lógica para abrir uma paleta de comandos
      }

      // N for New Task
      if (!isTyping && event.key.toLowerCase() === "n" && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        console.log("Atalho 'N' pressionado (Nova Tarefa)");
        router.push("/tasks?openNewTask=true");
      }

      // S for Search
      if (!isTyping && event.key.toLowerCase() === "s" && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        console.log("Atalho 'S' pressionado (Buscar)");
        router.push("/tasks"); 
        // Idealmente, focaria no campo de busca em /tasks.
      }
      
      // ? for Help
      if (!isTyping && event.key === "?" && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        console.log("Atalho '?' pressionado (Ajuda - Placeholder)");
        // Aqui você adicionaria a lógica para mostrar ajuda
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  if (isLoadingTasks) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        <span className="text-lg text-muted-foreground">Carregando dashboard...</span>
      </div>
    );
  }

  const upcomingTasksData = tasks
    .filter(t => t.status !== 'concluída' && t.deadline) 
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()) 
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Dashboard</h1>
      
      <DashboardMetrics tasks={tasks} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Próximas Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingTasks tasks={upcomingTasksData} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Lightbulb className="text-accent w-6 h-6" /> Dica Rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">
              Divida tarefas grandes em subtarefas menores para facilitar o gerenciamento e aumentar a sensação de progresso!
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Zap className="text-primary w-6 h-6" /> Atalhos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg hover:bg-card-foreground/10 transition-colors" title="Pressione ⌘ + K ou Ctrl + K">
            <span className="text-2xl mb-1">⌘</span>
            <span className="text-2xl mb-1">+</span>
            <span className="text-2xl font-bold">K</span>
            <p className="text-xs text-muted-foreground mt-1">Abrir comando</p>
          </div>
           <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg hover:bg-card-foreground/10 transition-colors" title="Pressione N" data-ai-hint="open new task form">
            <span className="text-2xl mb-1">N</span>
            <p className="text-xs text-muted-foreground mt-1 pt-11">Nova Tarefa</p>
          </div>
           <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg hover:bg-card-foreground/10 transition-colors" title="Pressione S" data-ai-hint="focus search bar">
            <span className="text-2xl mb-1">S</span>
            <p className="text-xs text-muted-foreground mt-1 pt-11">Buscar</p>
          </div>
           <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg hover:bg-card-foreground/10 transition-colors" title="Pressione ?">
            <span className="text-2xl mb-1">?</span>
            <p className="text-xs text-muted-foreground mt-1 pt-11">Ajuda</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
