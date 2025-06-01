
"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Loader2, Camera, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const USERS_STORAGE_KEY = "xmanager-users";
const CURRENT_USER_EMAIL_KEY = "xmanager-currentUserEmail";

interface StoredUser {
  name: string;
  email: string;
  phone: string;
  avatarDataUrl?: string; // Added for profile picture
}

export default function ProfilePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchUserData();
  }, []);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const firstInitial = names[0] ? names[0][0] : '';
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      if (file.size > 2 * 1024 * 1024) { // Limit to 2MB for example
        toast({
          title: "Arquivo muito grande",
          description: "Por favor, selecione uma imagem menor que 2MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const currentUserEmail = localStorage.getItem(CURRENT_USER_EMAIL_KEY);
        const allUsersString = localStorage.getItem(USERS_STORAGE_KEY);
        if (currentUserEmail && allUsersString) {
          try {
            let allUsers: StoredUser[] = JSON.parse(allUsersString);
            allUsers = allUsers.map(u => 
              u.email === currentUserEmail ? { ...u, avatarDataUrl: dataUrl } : u
            );
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
            setUser(prevUser => prevUser ? { ...prevUser, avatarDataUrl: dataUrl } : null);
            toast({
              title: "Foto de Perfil Atualizada!",
              description: "Sua nova foto de perfil foi salva.",
            });
          } catch (error) {
            console.error("Error updating user avatar in localStorage:", error);
            toast({
              title: "Erro ao Salvar",
              description: "Não foi possível atualizar sua foto de perfil.",
              variant: "destructive",
            });
          }
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-selecting the same file
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemovePicture = () => {
    if (user) {
      const currentUserEmail = localStorage.getItem(CURRENT_USER_EMAIL_KEY);
      const allUsersString = localStorage.getItem(USERS_STORAGE_KEY);
      if (currentUserEmail && allUsersString) {
        try {
          let allUsers: StoredUser[] = JSON.parse(allUsersString);
          allUsers = allUsers.map(u => 
            u.email === currentUserEmail ? { ...u, avatarDataUrl: undefined } : u
          );
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
          setUser(prevUser => prevUser ? { ...prevUser, avatarDataUrl: undefined } : null);
          toast({
            title: "Foto de Perfil Removida",
          });
        } catch (error) {
          console.error("Error removing user avatar from localStorage:", error);
          toast({
            title: "Erro ao Remover",
            description: "Não foi possível remover sua foto de perfil.",
            variant: "destructive",
          });
        }
      }
    }
  };

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
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Meu Perfil</h1>
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="items-center text-center">
          <div className="relative group">
            <Avatar className="h-32 w-32 mb-4 ring-4 ring-primary ring-offset-4 ring-offset-background">
              <AvatarImage 
                src={user.avatarDataUrl || `https://placehold.co/128x128.png?text=${getInitials(user.name)}`} 
                alt={user.name} 
                data-ai-hint={user.avatarDataUrl ? "user profile" : "abstract geometric"} 
              />
              <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute bottom-4 right-0 rounded-full h-10 w-10 bg-background/80 hover:bg-muted group-hover:opacity-100 opacity-50 transition-opacity"
              onClick={() => fileInputRef.current?.click()}
              title="Alterar foto de perfil"
            >
              <Camera className="h-5 w-5" />
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/png, image/jpeg, image/gif" 
              className="hidden" 
            />
          </div>
          <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
          <CardDescription>Suas informações pessoais e de contato.</CardDescription>
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
        <CardFooter className="flex justify-end">
          {user.avatarDataUrl && (
            <Button variant="ghost" size="sm" onClick={handleRemovePicture} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" /> Remover Foto
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

    