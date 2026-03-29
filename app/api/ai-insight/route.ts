import { NextRequest, NextResponse } from "next/server";
import { getAIInsight } from "@/lib/ai/claude-client";
import {
  PORTFOLIO_ANALYSIS_PROMPT,
  FIRE_COACH_PROMPT,
  HEALTH_SCORE_PROMPT,
  TAX_ADVISOR_PROMPT,
  LIFE_EVENT_PROMPT,
} from "@/lib/ai/prompts";
import { AIFeature } from "@/lib/ai/types";

const FALLBACK_INSIGHTS: Record<AIFeature, string> = {
  portfolio: `## Portfolio Analysis

**Overall Assessment:** Your portfolio shows a diversified mix of funds across market caps. 

**Key Observations:**
- Consider consolidating overlapping large-cap funds
- High expense ratio funds should be switched to direct plans
- Maintain 60-70% equity allocation if your investment horizon is 7+ years

**Recommendations:**
1. Switch regular plans to direct plans to save 0.5-1% annually
2. Add a Nifty 50 index fund for core large-cap exposure
3. Limit mid/small cap to 30% of portfolio
4. Review underperforming funds (XIRR < 8%)

**Action Plan:** Review and rebalance annually. Stay invested during market corrections.`,

  fire: `## FIRE Coach Analysis

**Current Status:** Your FIRE plan is on track with consistent SIP investments.

**Key Milestones:**
- Focus on maximizing SIP amount in early years
- Step up SIP by 10% annually
- Build 6-month emergency fund first

**Fund Recommendations:**
1. 60% in Nifty 50/500 index funds (low cost, market returns)
2. 30% in flexi-cap funds for alpha generation
3. 10% in international funds (Nasdaq 100) for diversification

**Risk Factors:** Inflation could erode purchasing power. Maintain equity exposure until 5 years before retirement.`,

  health: `## Financial Health Assessment

**Overall Assessment:** Focus on building strong financial foundations before aggressive investing.

**Top Priorities:**
1. Build 6-month emergency fund in liquid funds
2. Get ₹1 Cr term insurance (if not already done)
3. Maximize 80C investments before March 31

**Quick Wins:**
- Start ₹500/month SIP in index fund today
- Open NPS account for extra ₹50K deduction
- Get ₹10L health insurance cover

**90-Day Plan:** Month 1: Emergency fund. Month 2: Insurance. Month 3: Start SIPs.`,

  tax: `## Tax Analysis

**Regime Recommendation:** Compare both regimes based on your specific deductions.

**Missing Deductions:**
- Section 80C: Invest in ELSS funds, PPF, or tax-saving FD
- Section 80CCD(1B): NPS contribution up to ₹50,000
- Section 80D: Health insurance premiums

**Investment Suggestions:**
1. ELSS funds: Best 80C option (3-year lock-in, equity returns)
2. PPF: Safe 7.1% tax-free returns
3. NPS: Additional ₹50K deduction under 80CCD(1B)

**Savings Summary:** Proper tax planning can save ₹15,000 - ₹45,000 annually.`,

  "life-event": `## Financial Action Plan

**Immediate Actions (This Week):**
1. Review and update insurance nominations
2. Assess impact on emergency fund
3. Consult a financial advisor for personalized guidance

**30-Day Plan:**
- Update financial goals and budget
- Review investment allocation
- Consider tax implications

**3-Month Plan:**
- Implement new investment strategy
- Review and optimize tax deductions
- Set up automated SIPs for new goals

**Products to Consider:** Term insurance, ELSS for tax saving, NPS for retirement.`,
};

function buildUserMessage(feature: AIFeature, data: Record<string, unknown>): string {
  switch (feature) {
    case "portfolio":
      return `Analyze this mutual fund portfolio and provide rebalancing recommendations:
Total Invested: ₹${data.totalInvested || 0}
Current Value: ₹${data.currentValue || 0}
Overall XIRR: ${data.overallXirr || "N/A"}%
Number of Funds: ${data.holdingsCount || 0}
Holdings: ${JSON.stringify(data.holdings || [], null, 2)}`;

    case "fire":
      return `Analyze this FIRE plan and provide coaching:
Current Age: ${data.currentAge}
Target Retirement Age: ${data.targetRetirementAge}
Monthly Income: ₹${data.monthlyIncome}
Corpus Needed: ₹${data.corpusNeeded}
Monthly SIP Required: ₹${data.monthlySipRequired}
Years to Retirement: ${data.yearsToRetirement}
Existing Investments: ₹${data.existingInvestments}
Expected Return: ${data.expectedReturnRate}%`;

    case "health":
      return `Analyze this Money Health Score and provide recommendations:
Overall Score: ${data.overallScore}/100
Dimension Scores: ${JSON.stringify(data.dimensionScores, null, 2)}`;

    case "tax":
      return `Analyze this tax computation for FY 2025-26 and provide advice:
Gross Salary: ₹${data.grossSalary}
Old Regime Tax: ₹${data.oldRegimeTax}
New Regime Tax: ₹${data.newRegimeTax}
Better Regime: ${data.betterRegime}
Tax Saved: ₹${data.taxSaved}
Missing Deductions: ${JSON.stringify(data.missingDeductions, null, 2)}`;

    case "life-event":
      return `Create a financial action plan for this life event:
Event: ${data.event}
Income Range: ${data.incomeRange}
Risk Appetite: ${data.riskAppetite}
Existing Investments: ${data.existingInvestments}
Additional Context: ${data.context || ""}`;

    default:
      return JSON.stringify(data);
  }
}

function getSystemPrompt(feature: AIFeature): string {
  const prompts: Record<AIFeature, string> = {
    portfolio: PORTFOLIO_ANALYSIS_PROMPT,
    fire: FIRE_COACH_PROMPT,
    health: HEALTH_SCORE_PROMPT,
    tax: TAX_ADVISOR_PROMPT,
    "life-event": LIFE_EVENT_PROMPT,
  };
  return prompts[feature];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { feature: AIFeature; data: Record<string, unknown>; stream?: boolean };
    const { feature, data, stream = true } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
      const fallback = FALLBACK_INSIGHTS[feature] || "AI insights unavailable. Please add ANTHROPIC_API_KEY to .env.local";
      if (stream) {
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(fallback));
            controller.close();
          },
        });
        return new Response(readable, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
      return NextResponse.json({ insight: fallback });
    }

    const systemPrompt = getSystemPrompt(feature);
    const userMessage = buildUserMessage(feature, data);

    if (stream) {
      const aiStream = await getAIInsight(systemPrompt, userMessage, true);
      return new Response(aiStream as ReadableStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    const insight = await getAIInsight(systemPrompt, userMessage, false);
    return NextResponse.json({ insight });
  } catch (error) {
    const feature = "portfolio" as AIFeature;
    return NextResponse.json(
      { insight: FALLBACK_INSIGHTS[feature], error: "AI service unavailable" },
      { status: 200 }
    );
  }
}
