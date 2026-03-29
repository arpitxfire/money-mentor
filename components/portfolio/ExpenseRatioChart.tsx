"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, Legend } from "recharts";
import { CategoryAllocation, FundHolding } from "@/types/portfolio";
import { NIFTY50_CAGR } from "@/lib/constants/benchmarks";

const PIE_COLORS = ["#F5C842", "#34D399", "#818CF8", "#FB923C", "#F472B6", "#38BDF8", "#A78BFA", "#4ADE80"];

interface AllocationPieProps {
  allocations: CategoryAllocation[];
}

export function AllocationPie({ allocations }: AllocationPieProps) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-slate-300 font-medium mb-4">Category Allocation</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={allocations}
            cx="50%"
            cy="50%"
            outerRadius={85}
            innerRadius={50}
            dataKey="value"
            nameKey="category"
          >
            {allocations.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#0D2040", border: "1px solid #1A3360", borderRadius: "8px" }}
            formatter={(value: number, name: string) => [
              `₹${value.toLocaleString("en-IN")}`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 space-y-1">
        {allocations.map((a, i) => (
          <div key={a.category} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span className="text-slate-400">{a.category}</span>
            </div>
            <span className="text-slate-300 font-mono">{a.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PerformanceBarProps {
  holdings: FundHolding[];
}

export function PerformanceBar({ holdings }: PerformanceBarProps) {
  const data = holdings.map((h) => ({
    name: h.name.length > 20 ? h.name.substring(0, 18) + "..." : h.name,
    xirr: h.xirr ?? 0,
    benchmark: NIFTY50_CAGR,
  }));

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-slate-300 font-medium mb-4">Fund XIRR vs Benchmark</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A3360" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748B", fontSize: 10 }}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fill: "#64748B", fontSize: 11 }} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: "#0D2040", border: "1px solid #1A3360", borderRadius: "8px" }}
            formatter={(value: number) => [`${value.toFixed(1)}%`]}
          />
          <ReferenceLine y={NIFTY50_CAGR} stroke="#F5C842" strokeDasharray="4 4" label={{ value: "Nifty 50", fill: "#F5C842", fontSize: 11 }} />
          <Bar dataKey="xirr" fill="#34D399" radius={[3, 3, 0, 0]} name="XIRR" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ExpenseRatioChartProps {
  holdings: FundHolding[];
}

export function ExpenseRatioChart({ holdings }: ExpenseRatioChartProps) {
  const data = holdings.map((h) => ({
    name: h.name.length > 20 ? h.name.substring(0, 18) + "..." : h.name,
    er: h.expenseRatio,
    fill: h.expenseRatio > 1 ? "#F87171" : h.expenseRatio > 0.5 ? "#FBBF24" : "#34D399",
  }));

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-slate-300 font-medium mb-4">Expense Ratio Comparison</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A3360" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748B", fontSize: 10 }}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fill: "#64748B", fontSize: 11 }} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: "#0D2040", border: "1px solid #1A3360", borderRadius: "8px" }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, "Expense Ratio"]}
          />
          <ReferenceLine y={1} stroke="#F87171" strokeDasharray="4 4" label={{ value: "High ER", fill: "#F87171", fontSize: 11 }} />
          <Bar dataKey="er" name="Expense Ratio" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface XIRRCardProps {
  xirr: number | null;
  totalInvested: number;
  currentValue: number;
}

export function XIRRCard({ xirr, totalInvested, currentValue }: XIRRCardProps) {
  const gain = currentValue - totalInvested;
  const gainPct = totalInvested > 0 ? (gain / totalInvested) * 100 : 0;
  const isPositive = gain >= 0;

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 flex flex-col justify-between">
      <div className="text-slate-500 text-sm">Overall XIRR</div>
      <div className={`font-display text-4xl font-bold mt-2 font-mono ${xirr && xirr >= 0 ? "text-emerald-400" : "text-red-400"}`}>
        {xirr !== null ? `${xirr.toFixed(1)}%` : "—"}
      </div>
      <div className="text-slate-500 text-xs mt-1">Annualised returns (XIRR)</div>
      <div className={`mt-3 text-sm font-mono ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? "+" : ""}₹{Math.abs(gain).toLocaleString("en-IN")} ({gainPct.toFixed(1)}%)
      </div>
    </div>
  );
}
