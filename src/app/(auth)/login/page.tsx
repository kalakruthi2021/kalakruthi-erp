import type { Metadata } from "next";
import { LoginContent } from "./login-content";

export const metadata: Metadata = {
  title: "Login — Kalakruthi",
  description: "Sign in to Kalakruthi photography studio management platform",
};

export default function LoginPage() {
  return <LoginContent />;
}
