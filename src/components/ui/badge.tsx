"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        success: "bg-success-50 text-success-700 border border-success-100",
        warning: "bg-warning-50 text-warning-600 border border-warning-100",
        danger: "bg-danger-50 text-danger-600 border border-danger-100",
        info: "bg-info-50 text-info-600 border border-info-100",
        neutral: "bg-surface-sunken text-text-secondary border border-border",
        accent: "bg-accent-50 text-accent-600 border border-accent-100",
        // Role-specific badges (matching Figma's tag styles)
        customer: "bg-accent-50 text-accent-600 border border-accent-200",
        vendor: "bg-info-50 text-info-600 border border-info-200",
        employee: "bg-success-50 text-success-700 border border-success-200",
        freelancer: "bg-warning-50 text-warning-600 border border-warning-200",
        partner_studio: "bg-surface-sunken text-text-secondary border border-border",
        referrer: "bg-primary-50 text-primary-600 border border-primary-200",
      },
      size: {
        xs: "text-[9px] px-1.5 py-px leading-tight",
        sm: "text-[10px] px-1.5 py-px",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
