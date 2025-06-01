
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Loader2 } from "lucide-react";

const USERS_STORAGE_KEY = "xmanager-users";
const CURRENT_USER_EMAIL_KEY = "xmanager-currentUserEmail";

interface StoredUser {
  name: string;
  email: string;
  phone: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      setIsLoading(true);
      const currentUserEmail = localStorage.getItem(CURRENT_USER_EMAIL_KEY);
      if (currentUserEmail) {
        const allUsersString = localStorage.getItem(USERS_STORAGE_KEY);
        if (allUsersString) {
          try {
            const allUsers: StoredUser[] = JSON.parse(allUsersString);
            const foundUser = allUsers.find(u => u.email === currentUserEmail);
            setUser(foundUser || null);
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        <span className="text-lg text-muted-foreground">Carregando perfil...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold text-foreground mb-2">Usuário não encontrado</h1>
        <p className="text-muted-foreground">Não foi possível carregar as informações do perfil. Por favor, tente fazer login novamente.</p>
      </div>
    );
  }
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const firstInitial = names[0] ? names[0][0] : '';
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Meu Perfil</h1>
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary ring-offset-4 ring-offset-background">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.name)}`} alt={user.name} data-ai-hint="abstract geometric" />
            <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
          <CardDescription>Suas informações pessoais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="text-sm font-medium text-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Celular</p>
              <p className="text-sm font-medium text-foreground">{user.phone}</p>
            </div>
          </div>
           <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Nome de Usuário (para login)</p>
              <p className="text-sm font-medium text-foreground">{user.email.split('@')[0]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
