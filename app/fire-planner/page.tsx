"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import FireInputForm from "@/components/fire/FireInputForm";
import { ProjectionChart, GlidePath, SIPBreakdownTable } from "@/components/fire/ProjectionChart";
import AIInsightBox from "@/components/shared/AIInsightBox";
import NumberTicker from "@/components/shared/NumberTicker";
import { FireInputs, FireResults } from "@/types/fire";
import { calculateFIRE } from "@/lib/calculations/fire";
import { formatCurrencyCompact } from "@/lib/utils/formatters";
import { AlertTriangle } from "lucide-react";

export default function FirePlannerPage() {
  const [results, setResults] = useState<FireResults | null>(null);
  const [inputs, setInputs] = useState<FireInputs | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: FireInputs) => {
    setIsLoading(true);
    // Calculate locally for speed
    const fireResults = calculateFIRE(data);
    setResults(fireResults);
    setInputs(data);
    setIsLoading(false);
  };

  return (
    <PageWrapper title="FIRE Planner" subtitle="Financial Independence, Retire Early calculator">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel: Input Form */}
        <div className="w-full md:w-[40%] shrink-0">
          <div className="bg-navy-800 border border-navy-700 border-t-2 border-t-gold-400 rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold text-white mb-4">
              Your Details
            </h2>
            <FireInputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="flex-1 space-y-5">
          {!results && !isLoading && (
            <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
              Fill in your details to see your FIRE projection
            </div>
          )}

          {results && inputs && (
            <>
              {/* Warning if goal not achievable */}
              {!results.isGoalAchievable && (
                <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-3 text-yellow-400 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Required SIP ({formatCurrencyCompact(results.monthlySipRequired)}/mo) exceeds 50% of your income. Consider increasing your retirement age or reducing expenses.
                  </span>
                </div>
              )}

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800 border border-navy-700 rounded-xl p-4">
                  <div className="text-slate-500 text-xs mb-1">Corpus Needed</div>
                  <div className="font-mono text-xl font-bold text-gold-400">
                    <NumberTicker value={results.corpusNeeded} format="currency" />
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">Using 4% rule</div>
                </div>
                <div className="bg-navy-800 border border-navy-700 rounded-xl p-4">
                  <div className="text-slate-500 text-xs mb-1">Monthly SIP Required</div>
                  <div className="font-mono text-xl font-bold text-emerald-400">
                    <NumberTicker value={results.monthlySipRequired} format="currency" />
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">Starting today</div>
                </div>
                <div className="bg-navy-800 border border-navy-700 rounded-xl p-4">
                  <div className="text-slate-500 text-xs mb-1">Years to Retirement</div>
                  <div className="font-mono text-xl font-bold text-white">
                    <NumberTicker value={results.yearsToRetirement} suffix=" yrs" />
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">At age {inputs.targetRetirementAge}</div>
                </div>
                <div className="bg-navy-800 border border-navy-700 rounded-xl p-4">
                  <div className="text-slate-500 text-xs mb-1">Monthly Expense at Retirement</div>
                  <div className="font-mono text-xl font-bold text-slate-200">
                    <NumberTicker value={results.futureMonthlyExpense} format="currency" />
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">Inflation-adjusted</div>
                </div>
              </div>

              {/* Projection Chart */}
              <ProjectionChart
                projectionTable={results.projectionTable}
                corpusNeeded={results.corpusNeeded}
              />

              {/* Glide Path + Milestone Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlidePath glidePath={results.assetAllocationGlidePath} />
                <SIPBreakdownTable projectionTable={results.projectionTable} />
              </div>

              {/* AI Insight */}
              <AIInsightBox
                feature="fire"
                data={{
                  currentAge: inputs.currentAge,
                  targetRetirementAge: inputs.targetRetirementAge,
                  monthlyIncome: inputs.monthlyIncome,
                  corpusNeeded: results.corpusNeeded,
                  monthlySipRequired: results.monthlySipRequired,
                  yearsToRetirement: results.yearsToRetirement,
                  existingInvestments: inputs.existingInvestments,
                  expectedReturnRate: inputs.expectedReturnRate,
                }}
                title="🔥 FIRE Coach Advice"
              />
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
