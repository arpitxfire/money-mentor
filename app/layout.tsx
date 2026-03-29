import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "MoneyMentor AI — Indian Personal Finance Advisor",
  description:
    "AI-powered personal finance mentor for Indian retail investors. Portfolio X-Ray, FIRE Planner, Health Score, Tax Wizard, and Life Events planning.",
  keywords: "personal finance, mutual funds, FIRE planning, tax calculator, India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-950 text-slate-300 font-body antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-60">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
