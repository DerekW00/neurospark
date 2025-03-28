import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuroSpark - ADHD-Friendly Goal Management",
  description: "Break down overwhelming goals into manageable tasks with AI assistance. Designed for ADHD brains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-[var(--background)]`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
