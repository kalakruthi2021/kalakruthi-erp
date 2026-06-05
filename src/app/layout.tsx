import type { Metadata } from "next";
import { Outfit, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kalakruthi — Studio Management Platform",
    template: "%s — Kalakruthi",
  },
  description:
    "Complete studio management platform for Kalakruthi — photography, videography, events, billing, and operations.",
  keywords: ["studio management", "photography", "videography", "event management", "billing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
            },
            classNames: {
              toast: "shadow-lg border border-border",
              title: "text-sm font-medium",
              description: "text-xs text-text-secondary",
            },
          }}
        />
      </body>
    </html>
  );
}
