"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check if Supabase is configured
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        // Dev mode: bypass auth and go to dashboard
        router.push("/");
        return;
      }

      // Supabase auth
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-4 animate-fade-in-up">
      {/* Card */}
      <div className="card p-8 shadow-lg relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg mb-4">
            <Camera size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            Kalakruthi
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Photography Studio Management
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger-50 border border-danger-100 text-sm text-danger-600 animate-fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@kalakruthi.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-text-muted hover:text-text-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            <LogIn size={18} />
            Sign In
          </Button>
        </form>

        {/* Dev mode hint */}
        {(!process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (
          <div className="mt-6 p-3 rounded-lg bg-warning-50 border border-warning-100 text-xs text-warning-600">
            <strong>Dev Mode:</strong> Supabase not configured. Click Sign In to
            bypass authentication.
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-6">
          © {new Date().getFullYear()} Saiteja&apos;s Kalakruthi. All rights reserved.
        </p>
      </div>
    </div>
  );
}
