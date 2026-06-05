"use client";

import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface TabFilterProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TabFilter({ tabs, activeTab, onChange, className }: TabFilterProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-surface-sunken rounded-lg border border-border",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={activeTab === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
            activeTab === tab.value
              ? "bg-surface text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                activeTab === tab.value
                  ? "bg-accent-50 text-accent-600"
                  : "bg-surface-sunken text-text-muted"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
