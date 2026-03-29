"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FundHolding } from "@/types/portfolio";
import { formatCurrency, formatPct, getXIRRColor, getValueColor } from "@/lib/utils/formatters";

interface PortfolioTableProps {
  holdings: FundHolding[];
}

type SortField = "name" | "investedAmount" | "currentValue" | "gainLoss" | "xirr" | "expenseRatio";
type SortDir = "asc" | "desc";

const CATEGORY_COLORS: Record<string, string> = {
  "Large Cap": "bg-blue-400/15 text-blue-400",
  "Mid Cap": "bg-purple-400/15 text-purple-400",
  "Small Cap": "bg-orange-400/15 text-orange-400",
  "Flexi Cap": "bg-teal-400/15 text-teal-400",
  "ELSS": "bg-green-400/15 text-green-400",
  "Index Fund": "bg-slate-400/15 text-slate-400",
  "Hybrid": "bg-pink-400/15 text-pink-400",
  "Liquid": "bg-cyan-400/15 text-cyan-400",
  "Debt": "bg-yellow-400/15 text-yellow-400",
  "International": "bg-indigo-400/15 text-indigo-400",
};

export default function PortfolioTable({ holdings }: PortfolioTableProps) {
  const [sortField, setSortField] = useState<SortField>("currentValue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sorted = [...holdings].sort((a, b) => {
    let valA: number | string = 0;
    let valB: number | string = 0;

    switch (sortField) {
      case "name": valA = a.name; valB = b.name; break;
      case "investedAmount": valA = a.investedAmount; valB = b.investedAmount; break;
      case "currentValue": valA = a.currentValue; valB = b.currentValue; break;
      case "gainLoss": valA = a.gainLoss; valB = b.gainLoss; break;
      case "xirr": valA = a.xirr ?? -999; valB = b.xirr ?? -999; break;
      case "expenseRatio": valA = a.expenseRatio; valB = b.expenseRatio; break;
    }

    if (typeof valA === "string") {
      return sortDir === "asc" ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
    }
    return sortDir === "asc" ? valA - (valB as number) : (valB as number) - valA;
  });

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex flex-col ml-1">
      {sortField === field ? (
        sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      ) : (
        <ChevronDown className="w-3 h-3 text-slate-700" />
      )}
    </span>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-navy-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-700 bg-navy-900">
            <th className="text-left px-4 py-3 text-slate-500 font-medium cursor-pointer hover:text-slate-300" onClick={() => handleSort("name")}>
              Fund Name <SortIcon field="name" />
            </th>
            <th className="text-left px-3 py-3 text-slate-500 font-medium">Category</th>
            <th className="text-right px-3 py-3 text-slate-500 font-medium cursor-pointer hover:text-slate-300" onClick={() => handleSort("investedAmount")}>
              Invested <SortIcon field="investedAmount" />
            </th>
            <th className="text-right px-3 py-3 text-slate-500 font-medium cursor-pointer hover:text-slate-300" onClick={() => handleSort("currentValue")}>
              Current <SortIcon field="currentValue" />
            </th>
            <th className="text-right px-3 py-3 text-slate-500 font-medium cursor-pointer hover:text-slate-300" onClick={() => handleSort("gainLoss")}>
              Gain/Loss <SortIcon field="gainLoss" />
            </th>
            <th className="text-right px-3 py-3 text-slate-500 font-medium cursor-pointer hover:text-slate-300" onClick={() => handleSort("xirr")}>
              XIRR <SortIcon field="xirr" />
            </th>
            <th className="text-right px-3 py-3 text-slate-500 font-medium cursor-pointer hover:text-slate-300" onClick={() => handleSort("expenseRatio")}>
              Exp. Ratio <SortIcon field="expenseRatio" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((holding, i) => (
            <tr
              key={holding.id}
              className={`border-b border-navy-700/50 transition-colors hover:bg-navy-800/50 ${i % 2 === 0 ? "bg-navy-800/20" : ""}`}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-slate-200 max-w-xs truncate" title={holding.name}>
                  {holding.name}
                </div>
                <div className="text-slate-600 text-xs mt-0.5">
                  {holding.units.toFixed(3)} units @ ₹{holding.currentNav}
                </div>
              </td>
              <td className="px-3 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[holding.category] ?? "bg-slate-400/15 text-slate-400"}`}>
                  {holding.category}
                </span>
              </td>
              <td className="px-3 py-3 text-right font-mono text-slate-300">
                {formatCurrency(holding.investedAmount)}
              </td>
              <td className="px-3 py-3 text-right font-mono text-slate-200 font-medium">
                {formatCurrency(holding.currentValue)}
              </td>
              <td className={`px-3 py-3 text-right font-mono ${getValueColor(holding.gainLoss)}`}>
                <div>{formatCurrency(Math.abs(holding.gainLoss))}</div>
                <div className="text-xs">{formatPct(holding.gainLossPercent)}</div>
              </td>
              <td className={`px-3 py-3 text-right font-mono font-semibold ${getXIRRColor(holding.xirr)}`}>
                {holding.xirr !== null ? `${holding.xirr.toFixed(1)}%` : "—"}
              </td>
              <td className={`px-3 py-3 text-right font-mono text-xs ${holding.expenseRatio > 1 ? "text-red-400" : holding.expenseRatio > 0.5 ? "text-yellow-400" : "text-emerald-400"}`}>
                {holding.expenseRatio.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
