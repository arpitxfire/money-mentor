import { TaxInputs, TaxResult, TaxComparison, MissingDeduction } from "@/types/tax";
import {
  OLD_REGIME_SLABS,
  NEW_REGIME_SLABS,
  CESS_RATE,
  OLD_REGIME_DEDUCTIONS,
  NEW_REGIME_DEDUCTIONS,
  SECTION_87A_OLD,
  SECTION_87A_NEW,
  HRA_METRO_PERCENT,
  HRA_NON_METRO_PERCENT,
  BASIC_SALARY_PERCENT,
} from "@/lib/constants/tax-slabs";

function calculateSlabTax(taxableIncome: number, slabs: typeof OLD_REGIME_SLABS): number {
  let tax = 0;
  for (const slab of slabs) {
    if (taxableIncome <= 0) break;
    const slabMin = slab.min;
    const slabMax = slab.max ?? Infinity;
    const slabAmount = Math.min(taxableIncome, slabMax) - slabMin;
    if (slabAmount > 0 && taxableIncome > slabMin) {
      const taxableInSlab = Math.min(taxableIncome, slabMax) - slabMin;
      tax += taxableInSlab * (slab.rate / 100);
    }
  }
  return Math.max(0, tax);
}

export function calculateHRAExemption(
  grossSalary: number,
  hraReceived: number,
  rentPaid: number,
  cityType: "metro" | "non-metro"
): number {
  if (rentPaid <= 0 || hraReceived <= 0) return 0;

  const basicSalary = grossSalary * BASIC_SALARY_PERCENT;
  const hraPercent = cityType === "metro" ? HRA_METRO_PERCENT : HRA_NON_METRO_PERCENT;

  const exemption1 = hraReceived; // Actual HRA received
  const exemption2 = basicSalary * hraPercent; // % of basic
  const exemption3 = Math.max(0, rentPaid - basicSalary * 0.1); // Rent - 10% of basic

  return Math.min(exemption1, exemption2, exemption3);
}

export function calculateOldRegimeTax(inputs: TaxInputs): TaxResult {
  const {
    grossSalary,
    hraReceived,
    rentPaid,
    cityType,
    investments80C,
    investments80D,
    npsContribution,
    homeLoanInterest,
    otherIncome,
  } = inputs;

  const grossIncome = grossSalary + otherIncome;

  // Deductions
  const hraExemption = calculateHRAExemption(grossSalary, hraReceived, rentPaid, cityType);
  const standardDeduction = OLD_REGIME_DEDUCTIONS.standardDeduction;
  const deduction80C = Math.min(investments80C, OLD_REGIME_DEDUCTIONS.section80C);
  const deduction80D = Math.min(investments80D, OLD_REGIME_DEDUCTIONS.section80D_self);
  const deductionNPS = Math.min(npsContribution, OLD_REGIME_DEDUCTIONS.section80CCD1B);
  const deductionHomeLoan = Math.min(homeLoanInterest, OLD_REGIME_DEDUCTIONS.section24B);

  const totalDeductions =
    hraExemption +
    standardDeduction +
    deduction80C +
    deduction80D +
    deductionNPS +
    deductionHomeLoan;

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  let taxBeforeCess = calculateSlabTax(taxableIncome, OLD_REGIME_SLABS);

  // Section 87A rebate
  if (taxableIncome <= SECTION_87A_OLD.maxTaxableIncome) {
    taxBeforeCess = Math.max(0, taxBeforeCess - SECTION_87A_OLD.rebateAmount);
  }

  const cess = taxBeforeCess * CESS_RATE;
  const totalTax = taxBeforeCess + cess;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const inHandSalary = grossIncome - totalTax;

  return {
    grossIncome,
    hraExemption,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveTaxRate,
    inHandSalary,
  };
}

export function calculateNewRegimeTax(inputs: TaxInputs): TaxResult {
  const { grossSalary, otherIncome } = inputs;

  const grossIncome = grossSalary + otherIncome;

  // New regime: only standard deduction of 75K
  const standardDeduction = NEW_REGIME_DEDUCTIONS.standardDeduction;
  const totalDeductions = standardDeduction;

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  let taxBeforeCess = calculateSlabTax(taxableIncome, NEW_REGIME_SLABS);

  // Section 87A rebate for new regime: full rebate if taxable income ≤ 12L
  if (taxableIncome <= SECTION_87A_NEW.maxTaxableIncome) {
    taxBeforeCess = 0; // Full rebate
  }

  const cess = taxBeforeCess * CESS_RATE;
  const totalTax = taxBeforeCess + cess;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const inHandSalary = grossIncome - totalTax;

  return {
    grossIncome,
    hraExemption: 0,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveTaxRate,
    inHandSalary,
  };
}

export function compareTaxRegimes(inputs: TaxInputs): TaxComparison {
  const oldRegime = calculateOldRegimeTax(inputs);
  const newRegime = calculateNewRegimeTax(inputs);

  const betterRegime = oldRegime.totalTax <= newRegime.totalTax ? "old" : "new";
  const taxSaved = Math.abs(oldRegime.totalTax - newRegime.totalTax);

  // Calculate missing deductions
  const missingDeductions: MissingDeduction[] = [];

  const remaining80C = Math.max(
    0,
    OLD_REGIME_DEDUCTIONS.section80C - inputs.investments80C
  );
  if (remaining80C > 0) {
    missingDeductions.push({
      name: "Section 80C",
      maxAmount: OLD_REGIME_DEDUCTIONS.section80C,
      currentAmount: inputs.investments80C,
      potentialSaving: remaining80C * 0.3,
      section: "80C",
    });
  }

  if (inputs.npsContribution < OLD_REGIME_DEDUCTIONS.section80CCD1B) {
    const remainingNPS =
      OLD_REGIME_DEDUCTIONS.section80CCD1B - inputs.npsContribution;
    missingDeductions.push({
      name: "NPS (80CCD 1B)",
      maxAmount: OLD_REGIME_DEDUCTIONS.section80CCD1B,
      currentAmount: inputs.npsContribution,
      potentialSaving: remainingNPS * 0.3,
      section: "80CCD(1B)",
    });
  }

  if (inputs.investments80D < OLD_REGIME_DEDUCTIONS.section80D_self) {
    const remaining80D =
      OLD_REGIME_DEDUCTIONS.section80D_self - inputs.investments80D;
    missingDeductions.push({
      name: "Health Insurance (80D)",
      maxAmount: OLD_REGIME_DEDUCTIONS.section80D_self,
      currentAmount: inputs.investments80D,
      potentialSaving: remaining80D * 0.3,
      section: "80D",
    });
  }

  return {
    oldRegime,
    newRegime,
    betterRegime,
    taxSaved,
    missingDeductions,
  };
}
