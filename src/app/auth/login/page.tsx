import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-slate-900">
      <div className="w-full max-w-md">
       <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-headline font-bold text-foreground">Bem-vindo de volta!</h1>
          <p className="text-foreground/80 mt-2">Acesse sua conta XManager Personal.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-foreground/70">
          Não tem uma conta?{" "}
          <Button variant="link" asChild className="text-accent p-0 h-auto">
            <Link href="/auth/signup">Cadastre-se</Link>
          </Button>
        </p>
         <p className="mt-2 text-center text-sm text-foreground/70">
          <Button variant="link" asChild className="text-accent/80 p-0 h-auto text-xs">
            <Link href="/">Voltar para a página inicial</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
