"use client";

import { Bell, Search } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 border-b border-navy-700 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-6">
      <div className="flex-1">
        <h1 className="font-display text-xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center">
          <span className="text-gold-400 text-xs font-medium">MM</span>
        </div>
      </div>
    </header>
  );
}
