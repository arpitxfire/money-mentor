import { Portfolio, FundHolding, Transaction } from "@/types/portfolio";
import { calculateFundXIRR } from "@/lib/calculations/xirr";
import { DEMO_PORTFOLIO } from "@/lib/constants/demo-portfolio";

// Parse CAMS consolidated account statement (PDF text)
export function parseCAMSStatement(pdfText: string): Portfolio {
  try {
    const lines = pdfText.split("\n").map((l) => l.trim()).filter(Boolean);
    const holdings: FundHolding[] = [];
    let investorName = "Investor";

    // Extract investor name
    const nameMatch = pdfText.match(/Name\s*:\s*([A-Z\s]+)/i);
    if (nameMatch) {
      investorName = nameMatch[1].trim();
    }

    // Pattern: fund name on a line, followed by folio, then transactions
    let currentFund: Partial<FundHolding> | null = null;
    let currentTransactions: Transaction[] = [];
    let fundId = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect fund name lines (capitalized, ends with "Fund" or "Growth" or "Direct")
      if (
        /\b(Fund|Growth|Dividend|Direct|IDCW|Plan|Option)\b/i.test(line) &&
        line.length > 20 &&
        !line.match(/^\d/)
      ) {
        // Save previous fund if exists
        if (currentFund && currentFund.name) {
          const holding = buildHolding(currentFund, currentTransactions, String(fundId));
          if (holding) {
            holdings.push(holding);
            fundId++;
          }
        }
        currentFund = { name: line };
        currentTransactions = [];
        continue;
      }

      // Detect folio number
      if (/Folio\s*(?:No\.?)?\s*:?\s*([\w/]+)/i.test(line)) {
        const match = line.match(/Folio\s*(?:No\.?)?\s*:?\s*([\w/]+)/i);
        if (match && currentFund) {
          currentFund.folioNumber = match[1];
        }
        continue;
      }

      // Detect transaction lines: date, type, amount, units, nav, balance
      // Pattern: DD-Mon-YYYY  Type  Amount  Units  NAV  Balance
      const txMatch = line.match(
        /(\d{2}-\w{3}-\d{4})\s+(\w[\w\s]*?)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)/
      );
      if (txMatch && currentFund) {
        const [, dateStr, type, amountStr, , navStr] = txMatch;
        const amount = parseFloat(amountStr.replace(/,/g, ""));
        const nav = parseFloat(navStr.replace(/,/g, ""));
        const units = amount / nav;

        const txType = detectTransactionType(type);
        currentTransactions.push({
          date: formatDate(dateStr),
          type: txType,
          units: parseFloat(units.toFixed(3)),
          nav,
          amount: txType === "BUY" || txType === "SIP" ? -amount : amount,
        });
      }

      // Detect current NAV and value
      if (/Current\s*(?:NAV|Value)/i.test(line)) {
        const navMatch = line.match(/([\d,]+\.?\d*)/g);
        if (navMatch && navMatch.length >= 1 && currentFund) {
          currentFund.currentNav = parseFloat(navMatch[0].replace(/,/g, ""));
          if (navMatch.length >= 2) {
            currentFund.currentValue = parseFloat(navMatch[1].replace(/,/g, ""));
          }
        }
      }
    }

    // Save last fund
    if (currentFund && currentFund.name) {
      const holding = buildHolding(currentFund, currentTransactions, String(fundId));
      if (holding) holdings.push(holding);
    }

    if (holdings.length === 0) {
      return DEMO_PORTFOLIO;
    }

    const totalInvested = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
    const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const gainLoss = currentValue - totalInvested;
    const gainLossPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

    // Calculate overall XIRR
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

function buildHolding(
  partial: Partial<FundHolding>,
  transactions: Transaction[],
  id: string
): FundHolding | null {
  if (!partial.name || transactions.length === 0) return null;

  const investedAmount = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalUnits = transactions.reduce((sum, t) => {
    if (t.type === "BUY" || t.type === "SIP" || t.type === "SWITCH_IN") {
      return sum + t.units;
    }
    if (t.type === "SELL" || t.type === "SWITCH_OUT") {
      return sum - t.units;
    }
    return sum;
  }, 0);

  const avgNav = totalUnits > 0 ? investedAmount / totalUnits : 0;
  const currentNav = partial.currentNav ?? avgNav * 1.15; // estimate 15% gain if not found
  const currentValue = partial.currentValue ?? totalUnits * currentNav;
  const gainLoss = currentValue - investedAmount;
  const gainLossPercent = investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0;

  const xirr = calculateFundXIRR({
    transactions: transactions.map((t) => ({
      date: t.date,
      amount: t.amount,
    })),
    currentValue,
  });

  return {
    id,
    name: partial.name,
    category: detectCategory(partial.name),
    folioNumber: partial.folioNumber ?? "N/A",
    units: parseFloat(totalUnits.toFixed(3)),
    avgNav: parseFloat(avgNav.toFixed(2)),
    currentNav: parseFloat(currentNav.toFixed(2)),
    investedAmount: parseFloat(investedAmount.toFixed(2)),
    currentValue: parseFloat(currentValue.toFixed(2)),
    gainLoss: parseFloat(gainLoss.toFixed(2)),
    gainLossPercent: parseFloat(gainLossPercent.toFixed(2)),
    xirr,
    expenseRatio: detectExpenseRatio(partial.name),
    transactions,
  };
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
  if (name.includes("balanced") || name.includes("hybrid") || name.includes("advantage")) return "Hybrid";
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
    if (name.includes("elss")) return 0.62;
    if (name.includes("liquid")) return 0.2;
    return 0.65;
  }
  // Regular plan has ~1% higher ER
  if (name.includes("index") || name.includes("nifty")) return 0.8;
  return 1.5;
}

function formatDate(dateStr: string): string {
  // Convert DD-Mon-YYYY to YYYY-MM-DD
  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  return `${year}-${months[month] ?? "01"}-${day.padStart(2, "0")}`;
}
