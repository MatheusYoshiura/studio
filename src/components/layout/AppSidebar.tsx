
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ListChecks, CalendarDays, LogOut, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CURRENT_USER_EMAIL_KEY = "xmanager-currentUserEmail";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tarefas", icon: ListChecks },
  { href: "/schedule", label: "Cronograma", icon: CalendarDays },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
    router.push("/auth/login");
  };

  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 750);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[[data-collapsible=icon]]:justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--sidebar-primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="font-headline text-2xl font-semibold text-sidebar-foreground group-data-[[data-collapsible=icon]]:hidden">
            XManager
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {isLoading ? (
            <>
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </>
          ) : (
            navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, className: "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent"}}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[[data-collapsible=icon]]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
         {isLoading ? <SidebarMenuSkeleton showIcon /> : (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/profile"} 
              tooltip={{ children: "Perfil", className: "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent"}}
              className="justify-start"
            >
              <Link href="/profile"> 
                <UserCircle className="h-5 w-5" />
                <span className="group-data-[[data-collapsible=icon]]:hidden">Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={{ children: "Sair", className: "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent"}}
              className="justify-start text-destructive hover:bg-destructive/20 hover:text-destructive-foreground focus:text-destructive-foreground focus:bg-destructive/30"
            >
              <LogOut className="h-5 w-5" />
              <span className="group-data-[[data-collapsible=icon]]:hidden">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
         )}
      </SidebarFooter>
    </Sidebar>
  );
}
