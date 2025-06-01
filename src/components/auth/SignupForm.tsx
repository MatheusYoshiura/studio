
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  phone: z.string().regex(phoneRegex, { message: "Número de celular inválido."}),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres." }),
});

const USERS_STORAGE_KEY = "xmanager-users";

interface StoredUser {
  name: string;
  email: string;
  phone: string;
  passwordHash: string; 
  avatarDataUrl?: string; // Added for profile picture
}

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>([]);

  useEffect(() => {
    const usersFromStorage = localStorage.getItem(USERS_STORAGE_KEY);
    if (usersFromStorage) {
      setStoredUsers(JSON.parse(usersFromStorage));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const existingUser = storedUsers.find(user => user.email === values.email);
    if (existingUser) {
      toast({
        title: "Erro no Cadastro",
        description: "Este e-mail já está cadastrado. Tente fazer login.",
        variant: "destructive",
      });
      return;
    }

    const newUser: StoredUser = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      passwordHash: values.password, 
      avatarDataUrl: undefined, // Initialize with no avatar
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    setStoredUsers(updatedUsers);

    toast({
      title: "Cadastro Realizado!",
      description: "Sua conta foi criada com sucesso. Faça login para continuar.",
    });
    
    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Cadastro</CardTitle>
        <CardDescription>Preencha os campos para criar sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Celular</FormLabel>
                  <FormControl>
                    <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha forte"
                        {...field}
                      />
                       <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-input-foreground hover:bg-input-foreground/10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-headline bg-primary hover:bg-primary/90 text-primary-foreground">
              <UserPlus className="mr-2 h-5 w-5" /> Criar Conta
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    