
"use client";

import React from "react"; // Added import for React
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
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ListChecks, CalendarDays, Settings, LogOut, /* BarChart3, */ UserCircle } from "lucide-react"; // Removed BarChart3
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tarefas", icon: ListChecks },
  { href: "/schedule", label: "Cronograma", icon: CalendarDays },
  // { href: "/reports", label: "Relatórios", icon: BarChart3 }, // Removed
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Mock logout
    console.log("User logged out");
    router.push("/auth/login");
  };

  // Simple loading state simulation for skeleton
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
              {/* Removed one skeleton item to match navItems length */}
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
              isActive={pathname === "/profile"} // Placeholder
              tooltip={{ children: "Perfil", className: "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent"}}
              className="justify-start"
            >
              <Link href="/profile"> {/* Placeholder link */}
                <UserCircle className="h-5 w-5" />
                <span className="group-data-[[data-collapsible=icon]]:hidden">Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/settings"} // Placeholder
              tooltip={{ children: "Configurações", className: "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent"}}
              className="justify-start"
            >
              <Link href="/settings"> {/* Placeholder link */}
                <Settings className="h-5 w-5" />
                <span className="group-data-[[data-collapsible=icon]]:hidden">Configurações</span>
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
