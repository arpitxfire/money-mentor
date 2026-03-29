import { NextRequest, NextResponse } from "next/server";
import { compareTaxRegimes } from "@/lib/calculations/tax";
import { TaxInputs } from "@/types/tax";

export async function POST(request: NextRequest) {
  try {
    const inputs = await request.json() as TaxInputs;

    if (!inputs.grossSalary) {
      return NextResponse.json(
        { error: "Missing gross salary" },
        { status: 400 }
      );
    }

    const comparison = compareTaxRegimes(inputs);
    return NextResponse.json(comparison);
  } catch {
    return NextResponse.json(
      { error: "Tax calculation failed" },
      { status: 500 }
    );
  }
}
