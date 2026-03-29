"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { YearlyProjection, GlidePathPoint } from "@/types/fire";
import { formatCurrencyCompact } from "@/lib/utils/formatters";

interface ProjectionChartProps {
  projectionTable: YearlyProjection[];
  corpusNeeded: number;
}

export function ProjectionChart({ projectionTable, corpusNeeded }: ProjectionChartProps) {
  const data = projectionTable.map((p) => ({
    year: p.year,
    age: p.age,
    "With SIP": Math.round(p.portfolioValue),
    "Without SIP": Math.round(p.portfolioValue - p.sipContribution),
    Target: Math.round(corpusNeeded),
  }));

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-slate-300 font-medium mb-4">Corpus Growth Projection</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A3360" />
          <XAxis
            dataKey="age"
            tick={{ fill: "#64748B", fontSize: 11 }}
            label={{ value: "Age", position: "insideBottom", fill: "#64748B", offset: -2 }}
          />
          <YAxis
            tick={{ fill: "#64748B", fontSize: 10 }}
            tickFormatter={formatCurrencyCompact}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#0D2040", border: "1px solid #1A3360", borderRadius: "8px" }}
            formatter={(value: number, name: string) => [formatCurrencyCompact(value), name]}
            labelFormatter={(label) => `Age: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="With SIP"
            stroke="#F5C842"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Without SIP"
            stroke="#34D399"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Target"
            stroke="#F87171"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface GlidePathProps {
  glidePath: GlidePathPoint[];
}

export function GlidePath({ glidePath }: GlidePathProps) {
  const data = glidePath.map((p) => ({
    age: p.age,
    Equity: p.equityPercent,
    Debt: p.debtPercent,
  }));

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-slate-300 font-medium mb-1">Asset Allocation Glide Path</h3>
      <p className="text-slate-600 text-xs mb-4">Equity % reduces as you age (100 - age rule)</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A3360" />
          <XAxis dataKey="age" tick={{ fill: "#64748B", fontSize: 11 }} />
          <YAxis tick={{ fill: "#64748B", fontSize: 11 }} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: "#0D2040", border: "1px solid #1A3360", borderRadius: "8px" }}
            formatter={(value: number) => [`${value}%`]}
          />
          <Legend />
          <Bar dataKey="Equity" stackId="a" fill="#F5C842" />
          <Bar dataKey="Debt" stackId="a" fill="#34D399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface SIPBreakdownTableProps {
  projectionTable: YearlyProjection[];
}

export function SIPBreakdownTable({ projectionTable }: SIPBreakdownTableProps) {
  const milestones = projectionTable.filter((p) => p.year % 5 === 0 || p.year === projectionTable.length);

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-slate-300 font-medium mb-4">5-Year Milestone Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-700 text-slate-500">
              <th className="text-left py-2 pr-4">Year</th>
              <th className="text-left py-2 pr-4">Age</th>
              <th className="text-right py-2 pr-4">SIP Contributed</th>
              <th className="text-right py-2 pr-4">Portfolio Value</th>
              <th className="text-right py-2">Progress</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((m) => (
              <tr key={m.year} className="border-b border-navy-700/40">
                <td className="py-2 pr-4 text-slate-400">{m.year}</td>
                <td className="py-2 pr-4 text-slate-300">{m.age}</td>
                <td className="py-2 pr-4 text-right font-mono text-slate-300">
                  {formatCurrencyCompact(m.sipContribution)}
                </td>
                <td className="py-2 pr-4 text-right font-mono text-white font-medium">
                  {formatCurrencyCompact(m.portfolioValue)}
                </td>
                <td className="py-2 text-right font-mono">
                  <span className={m.progressPercent >= 100 ? "text-emerald-400" : "text-gold-400"}>
                    {m.progressPercent.toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
