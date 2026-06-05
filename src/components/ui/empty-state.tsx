"use client";

import { cn } from "@/lib/utils";
import { Inbox, Search, FileX2 } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "search" | "error";
  className?: string;
}

const variantIcons = {
  default: <Inbox size={48} />,
  search: <Search size={48} />,
  error: <FileX2 size={48} />,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in",
        className
      )}
    >
      <div className="text-text-muted mb-4">
        {icon ?? variantIcons[variant]}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-5">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
