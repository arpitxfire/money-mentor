"use client";

import { usePortfolioStore } from "@/store/portfolio-store";
import PageWrapper from "@/components/layout/PageWrapper";
import UploadZone from "@/components/portfolio/UploadZone";
import PortfolioTable from "@/components/portfolio/PortfolioTable";
import OverlapMatrix from "@/components/portfolio/OverlapMatrix";
import { AllocationPie, PerformanceBar, ExpenseRatioChart } from "@/components/portfolio/ExpenseRatioChart";
import AIInsightBox from "@/components/shared/AIInsightBox";
import NumberTicker from "@/components/shared/NumberTicker";
import { CategoryAllocation, FundHolding } from "@/types/portfolio";
import { AlertCircle } from "lucide-react";

function buildAllocations(holdings: FundHolding[]): CategoryAllocation[] {
  if (!holdings) return [];
  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const catMap = new Map<string, number>();
  for (const h of holdings) {
    catMap.set(h.category, (catMap.get(h.category) ?? 0) + h.currentValue);
  }
  return Array.from(catMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, value]) => ({
      category,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));
}

export default function PortfolioXRayPage() {
  const { portfolio, isDemo } = usePortfolioStore();

  const statCards = portfolio
    ? [
        {
          label: "Total Invested",
          value: portfolio.totalInvested,
          format: "currency" as const,
          color: "text-slate-200",
        },
        {
          label: "Current Value",
          value: portfolio.currentValue,
          format: "currency" as const,
          color: "text-slate-200",
        },
        {
          label: "Absolute Gain",
          value: portfolio.gainLoss,
          format: "currency" as const,
          color: portfolio.gainLoss >= 0 ? "text-emerald-400" : "text-red-400",
        },
        {
          label: "Overall XIRR",
          value: portfolio.overallXirr ?? 0,
          format: "percentage" as const,
          suffix: "% p.a.",
          color: (portfolio.overallXirr ?? 0) >= 0 ? "text-emerald-400" : "text-red-400",
        },
        {
          label: "Total Funds",
          value: portfolio.holdings.length,
          format: "number" as const,
          color: "text-slate-200",
        },
      ]
    : [];

  return (
    <PageWrapper title="Portfolio X-Ray" subtitle="Analyse your mutual fund portfolio">
      {!portfolio && (
        <div className="max-w-xl mx-auto mt-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-2">
            Upload Your Statement
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Upload your CAMS or KFintech consolidated account statement (PDF or CSV) to get a detailed portfolio analysis.
          </p>
          <UploadZone />
        </div>
      )}

      {portfolio && (
        <div className="space-y-6">
          {/* Demo Banner */}
          {isDemo && (
            <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-2.5 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Showing demo portfolio. Upload your actual statement for personalized analysis.</span>
            </div>
          )}

          {/* Section A: Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {statCards.map((card) => (
              <div key={card.label} className="bg-navy-800 border border-navy-700 rounded-xl p-4">
                <div className="text-slate-500 text-xs mb-1">{card.label}</div>
                <div className={`font-mono text-lg font-bold ${card.color}`}>
                  {card.format === "currency" ? (
                    <NumberTicker value={card.value} format="currency" />
                  ) : card.format === "percentage" ? (
                    <NumberTicker
                      value={card.value}
                      format="percentage"
                      decimals={1}
                      suffix=" p.a."
                    />
                  ) : (
                    <NumberTicker value={card.value} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Section B: Fund Table */}
          <div>
            <h2 className="font-display text-xl font-semibold text-white mb-3">
              Fund-wise Breakdown
            </h2>
            <PortfolioTable holdings={portfolio.holdings} />
          </div>

          {/* Section C: Charts */}
          <div>
            <h2 className="font-display text-xl font-semibold text-white mb-3">
              Visual Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AllocationPie allocations={buildAllocations(portfolio.holdings)} />
              <PerformanceBar holdings={portfolio.holdings} />
              <OverlapMatrix holdings={portfolio.holdings} />
            </div>
            <div className="mt-4">
              <ExpenseRatioChart holdings={portfolio.holdings} />
            </div>
          </div>

          {/* Section D: AI Insight */}
          <AIInsightBox
            feature="portfolio"
            data={{
              totalInvested: portfolio.totalInvested,
              currentValue: portfolio.currentValue,
              overallXirr: portfolio.overallXirr,
              holdingsCount: portfolio.holdings.length,
              holdings: portfolio.holdings.map((h) => ({
                name: h.name,
                category: h.category,
                xirr: h.xirr,
                expenseRatio: h.expenseRatio,
                gainLossPercent: h.gainLossPercent,
                currentValue: h.currentValue,
              })),
            }}
            title="🤖 AI Rebalancing Recommendation"
          />

          {/* Reset button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => usePortfolioStore.getState().reset()}
              className="text-slate-500 hover:text-slate-300 text-sm underline transition-colors"
            >
              Upload a different statement
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
