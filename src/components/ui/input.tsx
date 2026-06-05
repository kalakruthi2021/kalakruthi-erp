"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
            {props.required && <span className="text-danger-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary",
              "placeholder:text-text-muted",
              "transition-colors duration-200",
              "hover:border-border-strong",
              "focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-sunken",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-danger-500 mt-0.5">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-muted mt-0.5">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
