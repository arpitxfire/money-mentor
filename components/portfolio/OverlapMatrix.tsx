"use client";

import { FundHolding } from "@/types/portfolio";

interface OverlapMatrixProps {
  holdings: FundHolding[];
}

function getOverlapPercent(cat1: string, cat2: string): number {
  // Simplified overlap estimation based on categories
  if (cat1 === cat2) {
    if (cat1 === "Large Cap" || cat1 === "Index Fund") return 75;
    return 55;
  }
  const equityCategories = ["Large Cap", "Mid Cap", "Small Cap", "Flexi Cap", "Index Fund", "ELSS"];
  const bothEquity = equityCategories.includes(cat1) && equityCategories.includes(cat2);
  if (!bothEquity) return 5;

  const pairs: Record<string, number> = {
    "Large Cap_Flexi Cap": 55,
    "Flexi Cap_Large Cap": 55,
    "Large Cap_ELSS": 45,
    "ELSS_Large Cap": 45,
    "Index Fund_Large Cap": 80,
    "Large Cap_Index Fund": 80,
    "Flexi Cap_ELSS": 40,
    "ELSS_Flexi Cap": 40,
    "Mid Cap_Flexi Cap": 35,
    "Flexi Cap_Mid Cap": 35,
    "Large Cap_Mid Cap": 20,
    "Mid Cap_Large Cap": 20,
  };
  return pairs[`${cat1}_${cat2}`] ?? 15;
}

function getOverlapColor(overlap: number): string {
  if (overlap > 60) return "bg-red-400/20 text-red-400";
  if (overlap > 30) return "bg-yellow-400/20 text-yellow-400";
  return "bg-emerald-400/20 text-emerald-400";
}

export default function OverlapMatrix({ holdings }: OverlapMatrixProps) {
  const equityHoldings = holdings.filter((h) =>
    !["Liquid", "Debt"].includes(h.category)
  );

  if (equityHoldings.length < 2) {
    return (
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 text-center text-slate-500 text-sm">
        Add 2+ equity funds to see overlap analysis
      </div>
    );
  }

  const shortName = (name: string) => {
    const words = name.replace(/ Fund| Direct| Growth/gi, "").trim().split(" ");
    return words.slice(0, 3).join(" ");
  };

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <h3 className="text-slate-300 font-medium mb-4">Portfolio Overlap Matrix</h3>
      <div className="overflow-x-auto">
        <table className="text-xs w-full">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-500" />
              {equityHoldings.map((h) => (
                <th key={h.id} className="p-2 text-slate-500 font-normal max-w-[80px] text-center">
                  <div className="w-16 text-center" title={h.name}>
                    {shortName(h.name)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equityHoldings.map((row) => (
              <tr key={row.id}>
                <td className="p-2 text-slate-400 whitespace-nowrap max-w-[100px] truncate" title={row.name}>
                  {shortName(row.name)}
                </td>
                {equityHoldings.map((col) => {
                  if (row.id === col.id) {
                    return (
                      <td key={col.id} className="p-2 text-center">
                        <span className="inline-block w-10 h-6 bg-navy-700 rounded text-slate-600 text-xs flex items-center justify-center">—</span>
                      </td>
                    );
                  }
                  const overlap = getOverlapPercent(row.category, col.category);
                  return (
                    <td key={col.id} className="p-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${getOverlapColor(overlap)}`}>
                        {overlap}%
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3 mt-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400" /> &lt;30% Low</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-400" /> 30-60% Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-400" /> &gt;60% High</span>
      </div>
    </div>
  );
}
