import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "BuildSafe Nigeria | Trust-as-a-Service for Construction",
  description: "Securely manage construction projects in Nigeria from the diaspora. Verified builders, milestone-tied escrow payments, and real-time tracking.",
  keywords: ["build house Nigeria diaspora", "construction management Nigeria", "escrow payments Nigeria", "verified builders Lagos"],
};

import ConditionalNavbar from "@/components/ConditionalNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-slate-50 font-sans antialiased text-slate-900",
        inter.variable,
        outfit.variable
      )}>
        <div className="relative flex min-h-screen flex-col">
          <ConditionalNavbar />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
