
"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, UserCircle, Settings } from "lucide-react"; // Added Settings
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CURRENT_USER_EMAIL_KEY = "xmanager-currentUserEmail";
const USERS_STORAGE_KEY = "xmanager-users";

interface StoredUser {
  name: string;
  email: string;
  phone: string;
}

export default function AppHeader() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const userEmail = localStorage.getItem(CURRENT_USER_EMAIL_KEY);
    if (userEmail) {
      const usersFromStorage = localStorage.getItem(USERS_STORAGE_KEY);
      if (usersFromStorage) {
        const allUsers: StoredUser[] = JSON.parse(usersFromStorage);
        const foundUser = allUsers.find(u => u.email === userEmail);
        if (foundUser) {
          setCurrentUser({name: foundUser.name, email: foundUser.email, phone: foundUser.phone});
        }
      }
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
    setCurrentUser(null); // Clear current user state
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-header-bg px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-foreground/80 hover:text-foreground md:hidden" />
        <Link href="/dashboard" className="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <h1 className="text-xl font-headline font-semibold text-primary-foreground">XManager</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <UserCircle className="h-6 w-6" />
              <span className="sr-only">Menu do Usuário</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser?.name || "Usuário"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.email || "email@exemplo.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center w-full">
                 <UserCircle className="mr-2 h-4 w-4" /> Perfil
              </Link>
            </DropdownMenuItem>
            {/* Placeholder for settings, can be uncommented if a settings page is added */}
            {/* <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" /> Configurações
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem>Suporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
