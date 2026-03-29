"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Flame, Heart, Receipt, Target, TrendingUp, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    emoji: "📊",
    title: "Portfolio X-Ray",
    description: "Upload CAMS/KFintech statement. Get XIRR, overlap analysis, expense ratio drag, and AI rebalancing advice.",
    href: "/portfolio-xray",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Flame,
    emoji: "🔥",
    title: "FIRE Planner",
    description: "Calculate your retirement corpus, monthly SIP, and get a year-by-year projection to financial independence.",
    href: "/fire-planner",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: Heart,
    emoji: "💯",
    title: "Money Health Score",
    description: "5-minute questionnaire scores you across 6 financial dimensions with specific action plans.",
    href: "/health-score",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    icon: Receipt,
    emoji: "🧾",
    title: "Tax Wizard",
    description: "Old regime vs new regime comparison for FY 2025-26. Find missing deductions and save more tax.",
    href: "/tax-wizard",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Target,
    emoji: "🎯",
    title: "Life Events Advisor",
    description: "Bonus, marriage, baby, job loss — get a customized AI financial action plan for any life event.",
    href: "/life-events",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

const stats = [
  { value: "₹0", label: "Advisor Fee" },
  { value: "5", label: "Powerful Tools" },
  { value: "AI", label: "Powered by Claude" },
  { value: "100%", label: "Private & Secure" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy-950">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/30 rounded-full px-4 py-1.5 text-gold-400 text-sm mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>ET AI Hackathon 2026 — PS 9 Submission</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              Your AI-Powered
              <br />
              <span className="text-gold-400">Financial Advisor</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl mb-8 max-w-2xl">
              95% of Indians don&apos;t have a financial plan.{" "}
              <span className="text-slate-200">You&apos;re about to.</span>
              {" "}Get professional-grade financial analysis powered by Claude AI.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/portfolio-xray"
                className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Analyse Portfolio
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/fire-planner"
                className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white border border-navy-700 font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Plan Retirement
                <Flame className="w-4 h-4 text-orange-400" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 py-6 border-y border-navy-700 bg-navy-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-gold-400">
                {stat.value}
              </div>
              <div className="text-slate-500 text-sm mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-12">
        <div className="mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
            Five Powerful Tools
          </h2>
          <p className="text-slate-500">Everything you need for financial clarity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                href={feature.href}
                className="block bg-navy-800 border border-navy-700 hover:border-gold-400/40 rounded-xl p-6 transition-all duration-200 hover:bg-navy-800/80 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${feature.bg} rounded-xl mb-4 text-2xl`}
                >
                  {feature.emoji}
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center gap-1 mt-4 text-sm text-slate-500 group-hover:text-gold-400 transition-colors">
                  <span>Get started</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-10 border-t border-navy-700">
        <div className="max-w-3xl">
          <div className="flex items-start gap-3 mb-6">
            <Shield className="w-6 h-6 text-gold-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">
                Built for India
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                All calculations use Indian tax laws (FY 2025-26), Indian mutual fund categories, 
                Nifty 50 as benchmark, and ₹ Indian Rupee formatting. CAMS and KFintech statement 
                parsing is built-in.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-1">Disclaimer</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                MoneyMentor AI is for educational purposes only. It is not a SEBI-registered investment 
                advisor. Do not make financial decisions solely based on this tool. Please consult a 
                qualified financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
