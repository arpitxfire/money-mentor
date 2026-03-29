export interface FireInputs {
  currentAge: number;
  targetRetirementAge: number;
  monthlyIncome: number;
  monthlyExpensesNow: number;
  monthlyExpensesRetirement: number;
  existingInvestments: number;
  expectedReturnRate: number; // percentage, e.g., 12
  inflationRate: number; // percentage, e.g., 6
  lifeExpectancy: number;
}

export interface FireResults {
  yearsToRetirement: number;
  corpusNeeded: number;
  futureMonthlyExpense: number;
  fvExistingInvestments: number;
  remainingCorpusNeeded: number;
  monthlySipRequired: number;
  projectionTable: YearlyProjection[];
  assetAllocationGlidePath: GlidePathPoint[];
  isGoalAchievable: boolean;
}

export interface YearlyProjection {
  year: number;
  age: number;
  sipContribution: number;
  portfolioValue: number;
  targetCorpus: number;
  progressPercent: number;
}

export interface GlidePathPoint {
  age: number;
  equityPercent: number;
  debtPercent: number;
}
