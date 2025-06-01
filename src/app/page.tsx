import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Rocket, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-slate-900 p-6">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-4">
          XManager Personal
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Sua ferramenta definitiva para gerenciamento de tarefas e projetos pessoais. Simples, poderosa e focada em você.
        </p>
      </header>

      <main className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-4xl mb-16">
        <Card className="w-full md:w-1/2 bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <Rocket className="text-accent" />
              Organize Sua Vida
            </CardTitle>
            <CardDescription>
              Gerencie suas tarefas, defina prioridades e acompanhe seu progresso com facilidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-foreground/90 list-disc list-inside">
              <li>Criação intuitiva de tarefas e subtarefas.</li>
              <li>Visualização em cronograma.</li>
              <li>Relatórios de produtividade personalizados.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="w-full md:w-1/2 bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <ShieldCheck className="text-accent" />
              Foco e Eficiência
            </CardTitle>
            <CardDescription>
              Feito para uso individual, sem a complexidade de ferramentas corporativas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-foreground/90 list-disc list-inside">
              <li>Interface limpa e acessível.</li>
              <li>Anexos de arquivos direto nas tarefas.</li>
              <li>Design moderno e agradável.</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <div className="flex gap-4">
        <Button asChild size="lg" className="font-headline bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-headline border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
          <Link href="/auth/signup">Cadastre-se</Link>
        </Button>
      </div>

      <footer className="mt-16 text-center text-foreground/60">
        <p>&copy; {new Date().getFullYear()} XManager Personal. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
