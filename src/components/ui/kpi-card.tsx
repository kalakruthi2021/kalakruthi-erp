"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;       // "+12%", "-5%", "0%"
    direction: "up" | "down" | "flat";
    label?: string;      // "from last month"
  };
  icon?: React.ReactNode;
  className?: string;
}

export function KpiCard({ title, value, trend, icon, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "card p-5 flex flex-col gap-3 animate-fade-in-up",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        {icon && (
          <div className="text-text-muted">{icon}</div>
        )}
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-text-primary tracking-tight font-mono">
        {value}
      </p>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1.5 text-xs">
          {trend.direction === "up" && (
            <TrendingUp size={14} className="text-success-500" />
          )}
          {trend.direction === "down" && (
            <TrendingDown size={14} className="text-danger-500" />
          )}
          {trend.direction === "flat" && (
            <Minus size={14} className="text-text-muted" />
          )}
          <span
            className={cn(
              "font-medium",
              trend.direction === "up" && "text-success-600",
              trend.direction === "down" && "text-danger-600",
              trend.direction === "flat" && "text-text-muted"
            )}
          >
            {trend.value}
          </span>
          {trend.label && (
            <span className="text-text-muted">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
