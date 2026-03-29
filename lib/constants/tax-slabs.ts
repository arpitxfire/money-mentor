// FY 2025-26 Tax Slabs

export interface TaxSlab {
  min: number;
  max: number | null;
  rate: number; // percentage
}

// Old Regime Slabs (FY 2025-26)
export const OLD_REGIME_SLABS: TaxSlab[] = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: null, rate: 30 },
];

// New Regime Slabs (FY 2025-26)
export const NEW_REGIME_SLABS: TaxSlab[] = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 5 },
  { min: 800000, max: 1200000, rate: 10 },
  { min: 1200000, max: 1600000, rate: 15 },
  { min: 1600000, max: 2000000, rate: 20 },
  { min: 2000000, max: 2400000, rate: 25 },
  { min: 2400000, max: null, rate: 30 },
];

export const CESS_RATE = 0.04; // 4%

// Old Regime Deduction Limits
export const OLD_REGIME_DEDUCTIONS = {
  section80C: 150000, // 1.5L
  section80D_self: 25000, // 25K (50K for senior citizens)
  section80D_parents: 25000, // 25K (50K if senior citizen parents)
  section80CCD1B: 50000, // NPS additional 50K
  section24B: 200000, // Home loan interest 2L
  standardDeduction: 50000,
};

// New Regime Deductions
export const NEW_REGIME_DEDUCTIONS = {
  standardDeduction: 75000, // Increased in Budget 2024
};

// Section 87A Rebate
export const SECTION_87A_OLD = {
  maxTaxableIncome: 500000,
  rebateAmount: 12500,
};

export const SECTION_87A_NEW = {
  maxTaxableIncome: 1200000, // 12L
  rebateAmount: 60000, // Full tax rebate up to 12L taxable income
};

// HRA Exemption constants
export const HRA_METRO_PERCENT = 0.5; // 50% of basic for metro cities
export const HRA_NON_METRO_PERCENT = 0.4; // 40% for non-metro
export const BASIC_SALARY_PERCENT = 0.4; // Basic = 40% of gross CTC
export const HRA_RENT_THRESHOLD = 0.1; // Rent - 10% of basic

export const METRO_CITIES = ["Mumbai", "Delhi", "Kolkata", "Chennai", "Bangalore", "Hyderabad"];
