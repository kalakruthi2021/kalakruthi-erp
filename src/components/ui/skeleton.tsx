"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded-md h-4",
        variant === "rectangular" && "rounded-lg",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

/** Pre-built skeleton for a table row */
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border-subtle">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <Skeleton
            variant="text"
            width={i === 0 ? "60%" : `${40 + Math.random() * 30}%`}
          />
        </td>
      ))}
    </tr>
  );
}

/** Pre-built skeleton for a KPI card */
export function SkeletonKpiCard() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="circular" width={20} height={20} />
      </div>
      <Skeleton variant="text" width="40%" height={28} />
      <Skeleton variant="text" width="60%" height={14} />
    </div>
  );
}
