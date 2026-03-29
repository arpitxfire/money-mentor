import {
  HealthDimension,
  DimensionScore,
  HealthScoreResult,
  DIMENSION_WEIGHTS,
  DIMENSION_LABELS,
} from "@/types/health";

const DIMENSION_DIAGNOSES: Record<
  HealthDimension,
  { good: string; average: string; poor: string }
> = {
  emergencyFund: {
    good: "Excellent! You have a robust emergency fund covering 6+ months of expenses.",
    average: "You have some emergency savings, but aim for 6 months of expenses.",
    poor: "You lack an emergency fund. This is your #1 priority.",
  },
  insurance: {
    good: "Well-insured. Your life and health coverage protects your family adequately.",
    average: "Basic insurance coverage exists, but gaps remain in life/health cover.",
    poor: "Significant insurance gaps. Your family is financially vulnerable.",
  },
  diversification: {
    good: "Portfolio is well-diversified across asset classes and geographies.",
    average: "Some diversification, but over-concentration in certain assets.",
    poor: "Portfolio is poorly diversified. High concentration risk.",
  },
  debtHealth: {
    good: "Excellent debt health. EMI-to-income ratio is well within limits.",
    average: "Manageable debt levels. Watch EMI obligations carefully.",
    poor: "High debt burden. Focus on repayment and avoid new loans.",
  },
  taxEfficiency: {
    good: "Maximizing tax benefits through smart 80C and NPS investments.",
    average: "Partial tax optimization. Missing some deductions.",
    poor: "Significant tax optimization opportunities being missed.",
  },
  retirementReadiness: {
    good: "On track for retirement. Consistent SIP contributions and early start.",
    average: "Started retirement planning, but need to increase contributions.",
    poor: "Retirement planning urgently needed. Start SIPs immediately.",
  },
};

const DIMENSION_ACTIONS: Record<HealthDimension, Record<string, string[]>> = {
  emergencyFund: {
    good: ["Maintain your emergency fund in a liquid fund or FD", "Consider splitting between liquid fund and savings account"],
    average: ["Increase monthly savings to build 6-month emergency fund", "Keep emergency fund in liquid mutual funds for better returns"],
    poor: ["Start with 1 month expense target first", "Automate ₹5,000/month transfer to emergency fund", "Use SBI Liquid Fund or HDFC Liquid Fund"],
  },
  insurance: {
    good: ["Review coverage annually as income grows", "Consider term insurance increase with salary hikes"],
    average: ["Get pure term insurance: 10-12x annual income", "Add ₹10L health cover on top of employer insurance"],
    poor: ["Get term insurance immediately: 10x annual income", "Buy individual ₹10L health insurance", "Do NOT invest in ULIPs or endowment plans"],
  },
  diversification: {
    good: ["Review portfolio annually for rebalancing", "Consider adding international exposure via Nasdaq 100 fund"],
    average: ["Add debt allocation via short-term debt funds", "Reduce single-sector concentration"],
    poor: ["Start with a simple 3-fund portfolio", "60% large cap index + 20% mid cap + 20% liquid fund", "Avoid sector funds until basics are covered"],
  },
  debtHealth: {
    good: ["Consider prepaying high-interest loans", "Leverage home loan for tax benefit under Section 24B"],
    average: ["Prioritize prepaying personal loan / credit card debt", "EMI should not exceed 40% of monthly income"],
    poor: ["Stop all new debt immediately", "Use avalanche method: repay highest-interest debt first", "Consider debt consolidation loan if EMIs > 50% income"],
  },
  taxEfficiency: {
    good: ["Explore NPS Tier 2 for additional tax-free returns", "Consider ELSS for better returns vs traditional 80C options"],
    average: ["Maximize 80C: ELSS + PPF is the best combination", "Add NPS 80CCD(1B) for extra ₹50K deduction"],
    poor: ["Invest ₹1.5L in ELSS funds before March 31", "Open NPS account for additional ₹50K deduction", "Buy ₹25K health insurance for 80D deduction"],
  },
  retirementReadiness: {
    good: ["Maintain SIP discipline through market volatility", "Increase SIP amount by 10% every year"],
    average: ["Start a dedicated retirement SIP in index funds", "Target saving at least 20% of income for retirement"],
    poor: ["Start ₹5,000/month SIP in Nifty 50 index fund TODAY", "Open PPF account for guaranteed 7.1% returns", "Use EPF contribution as a forced retirement saving"],
  },
};

function getDiagnosisLevel(score: number): "good" | "average" | "poor" {
  if (score >= 70) return "good";
  if (score >= 40) return "average";
  return "poor";
}

export function calculateHealthScore(
  answers: Record<number, number>
): HealthScoreResult {
  // Map question IDs to dimensions
  const questionDimensions: Record<number, HealthDimension> = {
    1: "emergencyFund",
    2: "emergencyFund",
    3: "emergencyFund",
    4: "insurance",
    5: "insurance",
    6: "insurance",
    7: "diversification",
    8: "diversification",
    9: "diversification",
    10: "debtHealth",
    11: "debtHealth",
    12: "taxEfficiency",
    13: "taxEfficiency",
    14: "retirementReadiness",
    15: "retirementReadiness",
  };

  // Calculate dimension scores
  const dimensionRawScores: Record<HealthDimension, number[]> = {
    emergencyFund: [],
    insurance: [],
    diversification: [],
    debtHealth: [],
    taxEfficiency: [],
    retirementReadiness: [],
  };

  Object.entries(answers).forEach(([qId, score]) => {
    const dimension = questionDimensions[Number(qId)];
    if (dimension) {
      dimensionRawScores[dimension].push(score);
    }
  });

  const dimensionScores: DimensionScore[] = (
    Object.keys(dimensionRawScores) as HealthDimension[]
  ).map((dim) => {
    const scores = dimensionRawScores[dim];
    const avgScore =
      scores.length > 0
        ? scores.reduce((sum, s) => sum + s, 0) / scores.length
        : 50;

    const level = getDiagnosisLevel(avgScore);
    const diagnosis = DIMENSION_DIAGNOSES[dim][level];
    const actionItems = DIMENSION_ACTIONS[dim][level];

    return {
      dimension: dim,
      label: DIMENSION_LABELS[dim],
      score: Math.round(avgScore),
      weight: DIMENSION_WEIGHTS[dim],
      diagnosis,
      actionItems,
    };
  });

  // Calculate overall weighted score
  const overallScore = Math.round(
    dimensionScores.reduce(
      (sum, ds) => sum + ds.score * ds.weight,
      0
    )
  );

  return {
    overallScore,
    dimensionScores,
    answers,
  };
}
