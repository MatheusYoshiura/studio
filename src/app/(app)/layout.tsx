
"use client"; 

import type { ReactNode } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TaskProvider } from '@/contexts/TaskContext'; 

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <TaskProvider> 
      <SidebarProvider defaultOpen>
        <div className="flex h-screen bg-background">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-6 bg-background">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TaskProvider>
  );
}

    