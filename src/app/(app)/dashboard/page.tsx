import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { ProductivityReportSection } from "@/components/dashboard/ProductivityReportSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, Zap } from "lucide-react";

// Mock data for demonstration
const mockTasks = [
  { id: "1", name: "Finalizar relatório trimestral", deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), priority: "Alta", status: "em-progresso" },
  { id: "2", name: "Preparar apresentação para cliente", deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), priority: "Alta", status: "pendente" },
  { id: "3", name: "Revisar design do novo site", deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), priority: "Média", status: "pendente" },
  { id: "4", name: "Agendar reunião de equipe", deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), priority: "Baixa", status: "concluída" },
];


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Dashboard</h1>
      
      <DashboardMetrics tasks={mockTasks} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Próximas Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingTasks tasks={mockTasks.filter(t => t.status !== 'concluída').slice(0, 3)} />
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

      <ProductivityReportSection />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Zap className="text-primary w-6 h-6" /> Atalhos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg hover:bg-card-foreground/10 transition-colors">
            <span className="text-2xl mb-1">⌘</span>
            <span className="text-2xl mb-1">+</span>
            <span className="text-2xl font-bold">K</span>
            <p className="text-xs text-muted-foreground mt-1">Abrir comando</p>
          </div>
           <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg hover:bg-card-foreground/10 transition-colors">
            <span className="text-2xl mb-1">N</span>
            <p className="text-xs text-muted-foreground mt-1 pt-11">Nova Tarefa</p>
          </div>
           <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg hover:bg-card-foreground/10 transition-colors">
            <span className="text-2xl mb-1">S</span>
            <p className="text-xs text-muted-foreground mt-1 pt-11">Buscar</p>
          </div>
           <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg hover:bg-card-foreground/10 transition-colors">
            <span className="text-2xl mb-1">?</span>
            <p className="text-xs text-muted-foreground mt-1 pt-11">Ajuda</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
