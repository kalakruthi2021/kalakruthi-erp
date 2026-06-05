"use client";

import { Bell, Menu, Search, Command } from "lucide-react";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { cn } from "@/lib/utils";

export function Header() {
  const { openMobile } = useSidebarStore();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-4 lg:px-6 bg-surface/80 backdrop-blur-xl border-b border-border">
      {/* Mobile hamburger */}
      <button
        onClick={openMobile}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-sunken text-text-secondary transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <button
          className={cn(
            "flex items-center gap-3 w-full h-10 px-4 rounded-lg",
            "bg-surface-sunken border border-border",
            "text-sm text-text-muted",
            "hover:border-border-strong hover:text-text-secondary",
            "transition-all duration-200",
            "cursor-pointer"
          )}
          onClick={() => {
            // TODO: Open command palette
          }}
        >
          <Search size={16} className="text-text-muted" />
          <span className="flex-1 text-left">Search contacts, projects, payments...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-surface text-[10px] font-mono text-text-muted">
            <Command size={10} />K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-sunken text-text-secondary transition-colors"
          aria-label="View notifications"
        >
          <Bell size={18} />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-surface" />
        </button>

        {/* User Avatar */}
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-sunken transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            S
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-text-primary leading-tight">Saiteja</p>
            <p className="text-[10px] text-text-muted leading-tight">Owner</p>
          </div>
        </button>
      </div>
    </header>
  );
}
