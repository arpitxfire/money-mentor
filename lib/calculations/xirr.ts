// XIRR calculation using Newton-Raphson method
// XIRR solves for r in: sum(CF_i / (1+r)^((d_i - d_0)/365)) = 0

interface CashFlow {
  date: Date;
  amount: number;
}

function xnpv(rate: number, cashflows: CashFlow[]): number {
  const firstDate = cashflows[0].date.getTime();
  return cashflows.reduce((acc, cf) => {
    const daysDiff = (cf.date.getTime() - firstDate) / (1000 * 60 * 60 * 24);
    return acc + cf.amount / Math.pow(1 + rate, daysDiff / 365);
  }, 0);
}

function xnpvDerivative(rate: number, cashflows: CashFlow[]): number {
  const firstDate = cashflows[0].date.getTime();
  return cashflows.reduce((acc, cf) => {
    const daysDiff = (cf.date.getTime() - firstDate) / (1000 * 60 * 60 * 24);
    const t = daysDiff / 365;
    return acc - (t * cf.amount) / Math.pow(1 + rate, t + 1);
  }, 0);
}

export function calculateXIRR(cashflows: CashFlow[]): number | null {
  if (cashflows.length < 2) return null;

  // Check if all amounts are same sign (no gain/loss scenario)
  const hasPositive = cashflows.some((cf) => cf.amount > 0);
  const hasNegative = cashflows.some((cf) => cf.amount < 0);
  if (!hasPositive || !hasNegative) return null;

  let rate = 0.1; // initial guess: 10%
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    const npv = xnpv(rate, cashflows);
    const derivative = xnpvDerivative(rate, cashflows);

    if (Math.abs(derivative) < 1e-12) return null; // avoid division by zero

    const newRate = rate - npv / derivative;

    if (Math.abs(newRate - rate) < tolerance) {
      // Validate result is reasonable
      if (newRate < -0.999 || newRate > 100) return null;
      return newRate * 100; // return as percentage
    }

    rate = newRate;

    // Bounds check to prevent divergence
    if (rate < -0.999) rate = -0.999;
    if (rate > 100) rate = 100;
  }

  return null; // Did not converge
}

export interface XIRRInput {
  transactions: Array<{
    date: string;
    amount: number; // negative for investments, positive for redemptions
  }>;
  currentValue: number;
  currentDate?: string;
}

export function calculateFundXIRR(input: XIRRInput): number | null {
  const { transactions, currentValue, currentDate } = input;

  if (!transactions || transactions.length === 0) return null;

  const cashflows: CashFlow[] = transactions.map((t) => ({
    date: new Date(t.date),
    amount: t.amount, // negative = investment (outflow), positive = redemption (inflow)
  }));

  // Add current value as final positive cash flow
  cashflows.push({
    date: currentDate ? new Date(currentDate) : new Date(),
    amount: currentValue,
  });

  // Sort by date
  cashflows.sort((a, b) => a.date.getTime() - b.date.getTime());

  return calculateXIRR(cashflows);
}
