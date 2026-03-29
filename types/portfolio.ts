export interface Transaction {
  date: string;
  type: "BUY" | "SELL" | "SWITCH_IN" | "SWITCH_OUT" | "SIP" | "DIVIDEND";
  units: number;
  nav: number;
  amount: number;
}

export interface FundHolding {
  id: string;
  name: string;
  category: string;
  folioNumber: string;
  units: number;
  avgNav: number;
  currentNav: number;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  xirr: number | null;
  expenseRatio: number;
  transactions: Transaction[];
}

export interface Portfolio {
  totalInvested: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  overallXirr: number | null;
  holdings: FundHolding[];
  statementDate: string;
  investorName: string;
}

export interface OverlapData {
  fund1: string;
  fund2: string;
  overlapPercent: number;
}

export interface CategoryAllocation {
  category: string;
  value: number;
  percentage: number;
}
