export interface TaxInputs {
  grossSalary: number;
  hraReceived: number;
  rentPaid: number;
  cityType: "metro" | "non-metro";
  investments80C: number;
  investments80D: number;
  npsContribution: number;
  homeLoanInterest: number;
  otherIncome: number;
}

export interface TaxResult {
  grossIncome: number;
  hraExemption: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  effectiveTaxRate: number;
  inHandSalary: number;
}

export interface TaxComparison {
  oldRegime: TaxResult;
  newRegime: TaxResult;
  betterRegime: "old" | "new";
  taxSaved: number;
  missingDeductions: MissingDeduction[];
}

export interface MissingDeduction {
  name: string;
  maxAmount: number;
  currentAmount: number;
  potentialSaving: number;
  section: string;
}
