"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  imageUrl?: string | null;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Deterministic color based on name for consistent avatar colors
const AVATAR_COLORS = [
  "bg-accent-500",
  "bg-info-500",
  "bg-success-500",
  "bg-warning-500",
  "bg-primary-500",
  "bg-danger-500",
  "bg-accent-600",
  "bg-info-600",
] as const;

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function Avatar({ name, size = "md", imageUrl, className }: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
    xl: "w-14 h-14 text-lg",
  };

  if (imageUrl) {
    return (
      <div
        className={cn(
          "rounded-full overflow-hidden shrink-0 ring-2 ring-surface",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shrink-0 font-semibold text-white shadow-sm",
        sizeClasses[size],
        colorClass,
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
