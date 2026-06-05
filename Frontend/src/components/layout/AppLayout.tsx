'use client';

import React, { useState } from 'react';
import { RouteGuard } from '../common/RouteGuard';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RouteGuard requireAuth={true}>
      <div className="flex h-screen w-screen overflow-hidden bg-orange-50/60 dark:bg-zinc-900">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content shell */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
          <main className="flex-1 overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
