import { NextRequest, NextResponse } from "next/server";
import { calculateFIRE } from "@/lib/calculations/fire";
import { FireInputs } from "@/types/fire";

export async function POST(request: NextRequest) {
  try {
    const inputs = await request.json() as FireInputs;

    if (!inputs.currentAge || !inputs.targetRetirementAge || !inputs.monthlyIncome) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const results = calculateFIRE(inputs);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Calculation failed" },
      { status: 500 }
    );
  }
}
