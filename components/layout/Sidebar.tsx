"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Flame,
  Heart,
  Receipt,
  Target,
  TrendingUp,
} from "lucide-react";

const navItems = [
  {
    icon: BarChart3,
    label: "Portfolio X-Ray",
    href: "/portfolio-xray",
    emoji: "📊",
  },
  {
    icon: Flame,
    label: "FIRE Planner",
    href: "/fire-planner",
    emoji: "🔥",
  },
  {
    icon: Heart,
    label: "Health Score",
    href: "/health-score",
    emoji: "💯",
  },
  {
    icon: Receipt,
    label: "Tax Wizard",
    href: "/tax-wizard",
    emoji: "🧾",
  },
  {
    icon: Target,
    label: "Life Events",
    href: "/life-events",
    emoji: "🎯",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-navy-900 border-r border-navy-700 fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-navy-700">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-gold-400" />
            <span className="font-display text-xl font-bold text-white">
              MoneyMentor
              <sup className="text-gold-400 text-xs font-sans ml-0.5">AI</sup>
            </span>
          </Link>
          <p className="text-slate-500 text-xs mt-1">Indian Finance Advisor</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
                    ${
                      isActive
                        ? "bg-gold-400/10 text-gold-400 border-l-2 border-gold-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-navy-800 border-l-2 border-transparent"
                    }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-navy-700">
          <p className="text-slate-500 text-xs text-center">
            Powered by{" "}
            <span className="text-gold-400 font-medium">Claude AI</span>
          </p>
          <p className="text-slate-600 text-xs text-center mt-0.5">
            Not financial advice
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-900 border-t border-navy-700 px-2 py-1">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-xs transition-colors
                  ${isActive ? "text-gold-400" : "text-slate-500"}`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="mt-0.5 leading-tight text-center" style={{ fontSize: "10px" }}>
                  {item.label.split(" ")[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
