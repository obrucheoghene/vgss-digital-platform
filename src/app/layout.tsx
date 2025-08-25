import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthSessionProvider } from "@/components/providers/session-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import QueryProvider from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VGSS Platform - Volunteer Graduate Service Scheme",
  description:
    "Digital platform for managing the Volunteer Graduate Service Scheme",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <NextAuthSessionProvider>
            {children}
            <ToastProvider />
          </NextAuthSessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
