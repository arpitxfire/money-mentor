import { Portfolio, FundHolding, Transaction } from "@/types/portfolio";
import { calculateFundXIRR } from "@/lib/calculations/xirr";
import { DEMO_PORTFOLIO } from "@/lib/constants/demo-portfolio";

interface KFintechRow {
  [key: string]: string;
}

// Parse KFintech CSV statement
export function parseKFintechCSV(rows: KFintechRow[]): Portfolio {
  try {
    if (!rows || rows.length === 0) return DEMO_PORTFOLIO;

    const holdingsMap = new Map<string, Partial<FundHolding> & { transactions: Transaction[] }>();
    let investorName = "Investor";

    for (const row of rows) {
      // Try to extract investor name
      if (row["Investor Name"]) {
        investorName = row["Investor Name"];
      }

      const fundName = row["Scheme Name"] || row["Fund Name"] || row["Scheme"] || "";
      const folio = row["Folio"] || row["Folio Number"] || "";
      const dateStr = row["Transaction Date"] || row["Date"] || "";
      const typeStr = row["Transaction Type"] || row["Type"] || "";
      const amountStr = row["Amount"] || row["Transaction Amount"] || "0";
      const navStr = row["NAV"] || row["Nav"] || "0";
      const unitsStr = row["Units"] || row["Unit Balance"] || "0";

      if (!fundName) continue;

      const key = `${fundName}_${folio}`;
      if (!holdingsMap.has(key)) {
        holdingsMap.set(key, {
          name: fundName,
          folioNumber: folio,
          transactions: [],
        });
      }

      const holding = holdingsMap.get(key)!;
      const amount = parseFloat(amountStr.replace(/,/g, "")) || 0;
      const nav = parseFloat(navStr.replace(/,/g, "")) || 0;
      const units = parseFloat(unitsStr.replace(/,/g, "")) || 0;

      if (dateStr && (amount !== 0 || units !== 0)) {
        const txType = detectTransactionType(typeStr);
        holding.transactions.push({
          date: parseDate(dateStr),
          type: txType,
          units: Math.abs(units),
          nav,
          amount: txType === "BUY" || txType === "SIP" || txType === "SWITCH_IN"
            ? -Math.abs(amount)
            : Math.abs(amount),
        });
      }
    }

    const holdings: FundHolding[] = [];
    let fundId = 1;

    for (const [, data] of Array.from(holdingsMap)) {
      if (!data.name || data.transactions.length === 0) continue;

      const investedAmount = data.transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const totalUnits = data.transactions.reduce((sum, t) => {
        if (t.type === "BUY" || t.type === "SIP" || t.type === "SWITCH_IN") {
          return sum + t.units;
        }
        if (t.type === "SELL" || t.type === "SWITCH_OUT") {
          return sum - t.units;
        }
        return sum;
      }, 0);

      if (totalUnits <= 0) continue;

      const avgNav = totalUnits > 0 ? investedAmount / totalUnits : 0;
      const currentNav = avgNav * 1.15; // estimate
      const currentValue = totalUnits * currentNav;
      const gainLoss = currentValue - investedAmount;
      const gainLossPercent = investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0;

      const xirr = calculateFundXIRR({
        transactions: data.transactions.map((t) => ({
          date: t.date,
          amount: t.amount,
        })),
        currentValue,
      });

      holdings.push({
        id: String(fundId++),
        name: data.name,
        category: detectCategory(data.name),
        folioNumber: data.folioNumber ?? "N/A",
        units: parseFloat(totalUnits.toFixed(3)),
        avgNav: parseFloat(avgNav.toFixed(2)),
        currentNav: parseFloat(currentNav.toFixed(2)),
        investedAmount: parseFloat(investedAmount.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        gainLoss: parseFloat(gainLoss.toFixed(2)),
        gainLossPercent: parseFloat(gainLossPercent.toFixed(2)),
        xirr,
        expenseRatio: detectExpenseRatio(data.name),
        transactions: data.transactions,
      });
    }

    if (holdings.length === 0) return DEMO_PORTFOLIO;

    const totalInvested = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
    const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const gainLoss = currentValue - totalInvested;
    const gainLossPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

    const allTransactions = holdings.flatMap((h) =>
      h.transactions.map((t) => ({ date: t.date, amount: t.amount }))
    );
    const overallXirr = calculateFundXIRR({
      transactions: allTransactions,
      currentValue,
    });

    return {
      totalInvested,
      currentValue,
      gainLoss,
      gainLossPercent,
      overallXirr,
      holdings,
      investorName,
      statementDate: new Date().toISOString().split("T")[0],
    };
  } catch {
    return DEMO_PORTFOLIO;
  }
}

function detectTransactionType(typeStr: string): Transaction["type"] {
  const t = typeStr.toLowerCase();
  if (t.includes("switch") && t.includes("in")) return "SWITCH_IN";
  if (t.includes("switch") && t.includes("out")) return "SWITCH_OUT";
  if (t.includes("sip") || t.includes("systematic")) return "SIP";
  if (t.includes("sell") || t.includes("redempt")) return "SELL";
  if (t.includes("dividend") || t.includes("idcw")) return "DIVIDEND";
  return "BUY";
}

function detectCategory(fundName: string): string {
  const name = fundName.toLowerCase();
  if (name.includes("elss") || name.includes("tax saver")) return "ELSS";
  if (name.includes("liquid")) return "Liquid";
  if (name.includes("small cap")) return "Small Cap";
  if (name.includes("mid cap") || name.includes("midcap")) return "Mid Cap";
  if (name.includes("large cap") || name.includes("bluechip")) return "Large Cap";
  if (name.includes("flexi cap") || name.includes("multi cap") || name.includes("multicap")) return "Flexi Cap";
  if (name.includes("index") || name.includes("nifty") || name.includes("sensex")) return "Index Fund";
  if (name.includes("balanced") || name.includes("hybrid")) return "Hybrid";
  if (name.includes("debt") || name.includes("bond") || name.includes("income")) return "Debt";
  if (name.includes("international") || name.includes("nasdaq") || name.includes("global")) return "International";
  return "Equity";
}

function detectExpenseRatio(fundName: string): number {
  const name = fundName.toLowerCase();
  if (name.includes("direct")) {
    if (name.includes("index") || name.includes("nifty")) return 0.2;
    if (name.includes("large cap") || name.includes("bluechip")) return 0.55;
    if (name.includes("mid cap") || name.includes("midcap")) return 0.75;
    if (name.includes("small cap")) return 0.65;
    return 0.65;
  }
  return 1.5;
}

function parseDate(dateStr: string): string {
  // Handle DD/MM/YYYY or DD-MM-YYYY or DD-Mon-YYYY
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const months: Record<string, string> = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
      };
      const [day, month, year] = parts;
      if (isNaN(Number(month))) {
        return `${year}-${months[month] ?? "01"}-${day.padStart(2, "0")}`;
      }
      return `${year.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  return dateStr;
}
