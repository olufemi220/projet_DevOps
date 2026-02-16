import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Management System",
  description: "A premium student management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <ToastProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
