import { HealthQuestion } from "@/types/health";

export const HEALTH_QUESTIONS: HealthQuestion[] = [
  // Emergency Fund (Q1-Q3)
  {
    id: 1,
    dimension: "emergencyFund",
    question: "How many months of expenses do you have saved in liquid accounts (savings account, liquid fund, FD)?",
    options: [
      { text: "None", score: 0 },
      { text: "Less than 1 month", score: 20 },
      { text: "1-3 months", score: 50 },
      { text: "3-6 months", score: 75 },
      { text: "6+ months", score: 100 },
    ],
  },
  {
    id: 2,
    dimension: "emergencyFund",
    question: "Where is your emergency fund stored?",
    options: [
      { text: "Not applicable (no emergency fund)", score: 0 },
      { text: "Regular savings account", score: 40 },
      { text: "FD / RD", score: 70 },
      { text: "Liquid mutual fund", score: 90 },
      { text: "Split between liquid fund and savings account", score: 100 },
    ],
  },
  {
    id: 3,
    dimension: "emergencyFund",
    question: "If you lost your job today, how long could you maintain your current lifestyle?",
    options: [
      { text: "Less than 1 month", score: 0 },
      { text: "1-3 months", score: 30 },
      { text: "3-6 months", score: 60 },
      { text: "6-12 months", score: 85 },
      { text: "More than 12 months", score: 100 },
    ],
  },

  // Insurance (Q4-Q6)
  {
    id: 4,
    dimension: "insurance",
    question: "Do you have term life insurance coverage?",
    options: [
      { text: "No life insurance", score: 0 },
      { text: "Only employer-provided coverage", score: 25 },
      { text: "ULIP or endowment plan", score: 30 },
      { text: "Pure term insurance (< 5x income)", score: 60 },
      { text: "Pure term insurance (10x+ income)", score: 100 },
    ],
  },
  {
    id: 5,
    dimension: "insurance",
    question: "What is your health insurance situation?",
    options: [
      { text: "No health insurance", score: 0 },
      { text: "Only employer health insurance", score: 40 },
      { text: "Personal health cover < ₹5 lakh", score: 60 },
      { text: "Personal health cover ₹5-10 lakh", score: 80 },
      { text: "Personal health cover ₹10 lakh+ with top-up", score: 100 },
    ],
  },
  {
    id: 6,
    dimension: "insurance",
    question: "Do you have critical illness or disability insurance?",
    options: [
      { text: "No", score: 0 },
      { text: "Considering it", score: 20 },
      { text: "Have critical illness rider on life insurance", score: 60 },
      { text: "Standalone critical illness policy", score: 80 },
      { text: "Both critical illness + disability insurance", score: 100 },
    ],
  },

  // Investment Diversification (Q7-Q9)
  {
    id: 7,
    dimension: "diversification",
    question: "How is your investment portfolio distributed?",
    options: [
      { text: "Only FD/savings account", score: 10 },
      { text: "Only equity (stocks/mutual funds)", score: 40 },
      { text: "Equity + some FD/debt", score: 65 },
      { text: "Equity + debt + gold", score: 85 },
      { text: "Equity + debt + gold + international", score: 100 },
    ],
  },
  {
    id: 8,
    dimension: "diversification",
    question: "How many mutual funds do you currently invest in?",
    options: [
      { text: "None", score: 0 },
      { text: "1 fund", score: 40 },
      { text: "2-4 funds", score: 85 },
      { text: "5-8 funds (diversified categories)", score: 90 },
      { text: "9+ funds (may have too much overlap)", score: 55 },
    ],
  },
  {
    id: 9,
    dimension: "diversification",
    question: "What percentage of your savings are invested (not in savings/FD)?",
    options: [
      { text: "0% (all in savings/FD)", score: 0 },
      { text: "Less than 10%", score: 20 },
      { text: "10-25%", score: 50 },
      { text: "25-50%", score: 75 },
      { text: "50%+ in market-linked investments", score: 100 },
    ],
  },

  // Debt Health (Q10-Q11)
  {
    id: 10,
    dimension: "debtHealth",
    question: "What percentage of your monthly income goes toward EMIs?",
    options: [
      { text: "0% (no EMIs)", score: 100 },
      { text: "Less than 20%", score: 85 },
      { text: "20-35%", score: 60 },
      { text: "35-50%", score: 30 },
      { text: "More than 50%", score: 0 },
    ],
  },
  {
    id: 11,
    dimension: "debtHealth",
    question: "What types of loans do you have?",
    options: [
      { text: "No loans", score: 100 },
      { text: "Only home loan", score: 85 },
      { text: "Home loan + car loan", score: 65 },
      { text: "Personal loan or education loan", score: 40 },
      { text: "Credit card debt outstanding", score: 0 },
    ],
  },

  // Tax Efficiency (Q12-Q13)
  {
    id: 12,
    dimension: "taxEfficiency",
    question: "Do you maximize Section 80C deductions (₹1.5 lakh)?",
    options: [
      { text: "No, not aware of 80C", score: 0 },
      { text: "Partial (less than ₹1 lakh)", score: 30 },
      { text: "Mostly (₹1-1.5 lakh)", score: 70 },
      { text: "Full ₹1.5L but in FD/PPF only", score: 80 },
      { text: "Full ₹1.5L in ELSS (best option)", score: 100 },
    ],
  },
  {
    id: 13,
    dimension: "taxEfficiency",
    question: "Which tax regime are you using and is it optimal?",
    options: [
      { text: "Don't know / haven't calculated", score: 0 },
      { text: "New regime without comparing", score: 30 },
      { text: "Old regime without comparing", score: 30 },
      { text: "Calculated and chose the optimal regime", score: 75 },
      { text: "Optimal regime + NPS 80CCD + 80D optimized", score: 100 },
    ],
  },

  // Retirement Readiness (Q14-Q15)
  {
    id: 14,
    dimension: "retirementReadiness",
    question: "When did you start investing for retirement?",
    options: [
      { text: "Haven't started yet", score: 0 },
      { text: "Started after age 40", score: 25 },
      { text: "Started in 30s", score: 60 },
      { text: "Started in 20s", score: 85 },
      { text: "Started as soon as I got my first job", score: 100 },
    ],
  },
  {
    id: 15,
    dimension: "retirementReadiness",
    question: "What percentage of your income do you save/invest for retirement?",
    options: [
      { text: "0% — spending all income", score: 0 },
      { text: "Less than 5%", score: 15 },
      { text: "5-10%", score: 40 },
      { text: "10-20%", score: 70 },
      { text: "20%+ (on track for FIRE)", score: 100 },
    ],
  },
];
