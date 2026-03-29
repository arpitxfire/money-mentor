// Format currency in Indian format (₹1,23,456)
export function formatCurrency(amount: number, showDecimal: boolean = false): string {
  if (isNaN(amount) || !isFinite(amount)) return "₹0";

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = absAmount.toLocaleString("en-IN", {
    minimumFractionDigits: showDecimal ? 2 : 0,
    maximumFractionDigits: showDecimal ? 2 : 0,
  });

  return `${isNegative ? "-" : ""}₹${formatted}`;
}

// Format large numbers with crore/lakh suffix
export function formatCurrencyCompact(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return "₹0";

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (absAmount >= 10000000) {
    return `${sign}₹${(absAmount / 10000000).toFixed(2)} Cr`;
  }
  if (absAmount >= 100000) {
    return `${sign}₹${(absAmount / 100000).toFixed(2)} L`;
  }
  if (absAmount >= 1000) {
    return `${sign}₹${(absAmount / 1000).toFixed(1)}K`;
  }
  return `${sign}₹${absAmount.toFixed(0)}`;
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value) || !isFinite(value)) return "0.0%";
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

// Format percentage without + sign
export function formatPct(value: number, decimals: number = 1): string {
  if (isNaN(value) || !isFinite(value)) return "0.0%";
  return `${value.toFixed(decimals)}%`;
}

// Format number as Indian number format
export function formatIndianNumber(num: number): string {
  if (isNaN(num) || !isFinite(num)) return "0";
  return num.toLocaleString("en-IN");
}

// Get color class based on value (positive = green, negative = red)
export function getValueColor(value: number): string {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-red-400";
  return "text-slate-300";
}

// Get XIRR color class
export function getXIRRColor(xirr: number | null): string {
  if (xirr === null) return "text-slate-500";
  if (xirr >= 12) return "text-emerald-400";
  if (xirr >= 8) return "text-yellow-400";
  return "text-red-400";
}

// Format date to display format
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Format number with units
export function formatUnits(units: number): string {
  return units.toLocaleString("en-IN", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

// Get score color class
export function getScoreColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

// Get score background color
export function getScoreBgColor(score: number): string {
  if (score >= 75) return "bg-emerald-400/10 border-emerald-400/30";
  if (score >= 50) return "bg-yellow-400/10 border-yellow-400/30";
  return "bg-red-400/10 border-red-400/30";
}
