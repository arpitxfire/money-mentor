export interface HealthQuestion {
  id: number;
  dimension: HealthDimension;
  question: string;
  options: HealthOption[];
}

export interface HealthOption {
  text: string;
  score: number;
}

export type HealthDimension =
  | "emergencyFund"
  | "insurance"
  | "diversification"
  | "debtHealth"
  | "taxEfficiency"
  | "retirementReadiness";

export interface DimensionScore {
  dimension: HealthDimension;
  label: string;
  score: number;
  weight: number;
  diagnosis: string;
  actionItems: string[];
}

export interface HealthScoreResult {
  overallScore: number;
  dimensionScores: DimensionScore[];
  answers: Record<number, number>;
}

export const DIMENSION_WEIGHTS: Record<HealthDimension, number> = {
  emergencyFund: 0.2,
  insurance: 0.2,
  diversification: 0.2,
  debtHealth: 0.15,
  taxEfficiency: 0.1,
  retirementReadiness: 0.15,
};

export const DIMENSION_LABELS: Record<HealthDimension, string> = {
  emergencyFund: "Emergency Fund",
  insurance: "Insurance Coverage",
  diversification: "Investment Diversification",
  debtHealth: "Debt Health",
  taxEfficiency: "Tax Efficiency",
  retirementReadiness: "Retirement Readiness",
};
