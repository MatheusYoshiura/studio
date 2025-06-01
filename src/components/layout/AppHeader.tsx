
"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, UserCircle, Settings } from "lucide-react"; 
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const CURRENT_USER_EMAIL_KEY = "xmanager-currentUserEmail";
const USERS_STORAGE_KEY = "xmanager-users";

interface StoredUser {
  name: string;
  email: string;
  phone: string;
  avatarDataUrl?: string;
}

export default function AppHeader() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const fetchAndSetUser = () => {
      const userEmail = localStorage.getItem(CURRENT_USER_EMAIL_KEY);
      if (userEmail) {
        const usersFromStorage = localStorage.getItem(USERS_STORAGE_KEY);
        if (usersFromStorage) {
          try {
            const allUsers: StoredUser[] = JSON.parse(usersFromStorage);
            const foundUser = allUsers.find(u => u.email === userEmail);
            if (foundUser) {
              setCurrentUser(foundUser);
            } else {
              setCurrentUser(null); // User email in current key, but not in users list
            }
          } catch (error) {
            console.error("Error parsing users from storage in AppHeader:", error);
            setCurrentUser(null);
          }
        } else {
            setCurrentUser(null); // No users in storage
        }
      } else {
        setCurrentUser(null); // No current user email
      }
    };

    fetchAndSetUser(); // Initial fetch

    // Listen for storage changes to update avatar in header if changed on profile page
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === USERS_STORAGE_KEY || event.key === CURRENT_USER_EMAIL_KEY) {
             fetchAndSetUser(); // Re-fetch user data if users or current user key changes
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
    setCurrentUser(null); 
    router.push("/auth/login");
  };
  
  const getInitials = (name: string | undefined) => {
    if (!name) return "U"; // Default if name is undefined
    const names = name.split(' ');
    const firstInitial = names[0] ? names[0][0] : '';
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || "U"; // Ensure "U" if initials are empty
  }


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
            <Button variant="ghost" className="rounded-full p-0 h-8 w-8 focus-visible:ring-0 focus-visible:ring-offset-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
               <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatarDataUrl || undefined} alt={currentUser?.name || "User Avatar"} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {currentUser ? getInitials(currentUser.name) : <UserCircle className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
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
