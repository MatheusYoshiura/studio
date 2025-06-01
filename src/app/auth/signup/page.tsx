import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
          </div>
          <h1 className="text-4xl font-headline font-bold text-foreground">Crie sua conta</h1>
          <p className="text-foreground/80 mt-2">Junte-se ao XManager Personal e organize suas tarefas.</p>
        </div>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-foreground/70">
          Já tem uma conta?{" "}
          <Link href="/auth/login" className="font-medium text-accent hover:underline">
            Faça login
          </Link>
        </p>
         <p className="mt-2 text-center text-sm text-foreground/70">
          <Link href="/" className="font-medium text-accent/80 hover:underline text-xs">
            Voltar para a página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}
