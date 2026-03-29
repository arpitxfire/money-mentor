import { FireInputs, FireResults, YearlyProjection, GlidePathPoint } from "@/types/fire";

// Calculate future value of existing investments
function calculateFutureValue(
  principal: number,
  annualRate: number,
  years: number
): number {
  return principal * Math.pow(1 + annualRate / 100, years);
}

// Calculate inflation-adjusted future expense
function calculateInflationAdjustedExpense(
  currentExpense: number,
  inflationRate: number,
  years: number
): number {
  return currentExpense * Math.pow(1 + inflationRate / 100, years);
}

// Calculate corpus needed using 4% withdrawal rule
function calculateCorpusNeeded(annualExpense: number): number {
  return annualExpense / 0.04; // 4% withdrawal rate
}

// Calculate monthly SIP required using PMT formula
// PMT = (FV * r) / ((1+r)^n - 1)
function calculateMonthlySIP(
  targetCorpus: number,
  annualReturnRate: number,
  years: number
): number {
  if (targetCorpus <= 0) return 0;

  const monthlyRate = annualReturnRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) return targetCorpus / months;

  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  if (denominator === 0) return 0;

  return (targetCorpus * monthlyRate) / denominator;
}

// Calculate SIP future value
// FV = PMT × ((1+r)^n - 1) / r × (1+r)
function calculateSIPFutureValue(
  monthlyAmount: number,
  annualReturnRate: number,
  years: number
): number {
  const monthlyRate = annualReturnRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) return monthlyAmount * months;

  return (
    monthlyAmount *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate)
  );
}

export function calculateFIRE(inputs: FireInputs): FireResults {
  const {
    currentAge,
    targetRetirementAge,
    monthlyExpensesRetirement,
    existingInvestments,
    expectedReturnRate,
    inflationRate,
    lifeExpectancy,
  } = inputs;

  const yearsToRetirement = targetRetirementAge - currentAge;

  if (yearsToRetirement <= 0) {
    // Already at or past retirement age
    const futureMonthlyExpense = monthlyExpensesRetirement;
    const annualExpense = futureMonthlyExpense * 12;
    const corpusNeeded = calculateCorpusNeeded(annualExpense);
    return {
      yearsToRetirement: 0,
      corpusNeeded,
      futureMonthlyExpense,
      fvExistingInvestments: existingInvestments,
      remainingCorpusNeeded: Math.max(0, corpusNeeded - existingInvestments),
      monthlySipRequired: 0,
      projectionTable: [],
      assetAllocationGlidePath: [],
      isGoalAchievable: existingInvestments >= corpusNeeded,
    };
  }

  // Step 1: Calculate inflation-adjusted monthly expenses at retirement
  const futureMonthlyExpense = calculateInflationAdjustedExpense(
    monthlyExpensesRetirement,
    inflationRate,
    yearsToRetirement
  );

  // Step 2: Calculate corpus needed
  const annualExpenseAtRetirement = futureMonthlyExpense * 12;
  const corpusNeeded = calculateCorpusNeeded(annualExpenseAtRetirement);

  // Step 3: Future value of existing investments
  const fvExistingInvestments = calculateFutureValue(
    existingInvestments,
    expectedReturnRate,
    yearsToRetirement
  );

  // Step 4: Remaining corpus needed
  const remainingCorpusNeeded = Math.max(0, corpusNeeded - fvExistingInvestments);

  // Step 5: Monthly SIP required
  const monthlySipRequired = calculateMonthlySIP(
    remainingCorpusNeeded,
    expectedReturnRate,
    yearsToRetirement
  );

  // Step 6: Year-by-year projection table
  const projectionTable: YearlyProjection[] = [];
  let cumulativeSIP = 0;

  for (let year = 1; year <= yearsToRetirement; year++) {
    const age = currentAge + year;
    const sipForYear = monthlySipRequired * 12;
    cumulativeSIP += sipForYear;

    const portfolioValueWithSIP =
      calculateFutureValue(existingInvestments, expectedReturnRate, year) +
      calculateSIPFutureValue(monthlySipRequired, expectedReturnRate, year);

    const progressPercent = Math.min(
      100,
      (portfolioValueWithSIP / corpusNeeded) * 100
    );

    projectionTable.push({
      year,
      age,
      sipContribution: cumulativeSIP,
      portfolioValue: portfolioValueWithSIP,
      targetCorpus: corpusNeeded,
      progressPercent,
    });
  }

  // Step 7: Asset allocation glide path (equity% = 100 - age, capped at 80%)
  const assetAllocationGlidePath: GlidePathPoint[] = [];
  for (let age = currentAge; age <= lifeExpectancy; age += 5) {
    const equityPercent = Math.max(20, Math.min(80, 100 - age));
    assetAllocationGlidePath.push({
      age,
      equityPercent,
      debtPercent: 100 - equityPercent,
    });
  }

  const isGoalAchievable = monthlySipRequired < inputs.monthlyIncome * 0.5;

  return {
    yearsToRetirement,
    corpusNeeded,
    futureMonthlyExpense,
    fvExistingInvestments,
    remainingCorpusNeeded,
    monthlySipRequired,
    projectionTable,
    assetAllocationGlidePath,
    isGoalAchievable,
  };
}
