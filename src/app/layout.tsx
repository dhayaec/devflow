import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/components/auth/session-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SkipToContent } from "@/components/ui/skip-to-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevFlow",
  description: "All-in-one developer collaboration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(`${geistSans.variable} ${geistMono.variable} h-full antialiased`)} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <SkipToContent />
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
