import { NextRequest, NextResponse } from "next/server";
import { DEMO_PORTFOLIO } from "@/lib/constants/demo-portfolio";
import { parseCAMSStatement } from "@/lib/parsers/cams-parser";
import { parseKFintechCSV } from "@/lib/parsers/kfintech-parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { portfolio: DEMO_PORTFOLIO, isDemo: true, message: "No file provided, using demo portfolio" },
        { status: 200 }
      );
    }

    const fileName = file.name.toLowerCase();
    const fileBuffer = await file.arrayBuffer();

    if (fileName.endsWith(".csv")) {
      // Parse CSV with Papa Parse
      const text = new TextDecoder().decode(fileBuffer);
      const { default: Papa } = await import("papaparse");
      const result = Papa.parse(text, { header: true, skipEmptyLines: true });
      const portfolio = parseKFintechCSV(result.data as Record<string, string>[]);
      const isDemo = portfolio === DEMO_PORTFOLIO;
      return NextResponse.json({ portfolio, isDemo });
    }

    if (fileName.endsWith(".pdf")) {
      // Parse PDF
      try {
        const pdfParse = (await import("pdf-parse")).default;
        const pdfData = await pdfParse(Buffer.from(fileBuffer));
        const portfolio = parseCAMSStatement(pdfData.text);
        const isDemo = portfolio === DEMO_PORTFOLIO;
        return NextResponse.json({ portfolio, isDemo });
      } catch {
        return NextResponse.json(
          { portfolio: DEMO_PORTFOLIO, isDemo: true, message: "PDF parsing failed, using demo portfolio" },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      { portfolio: DEMO_PORTFOLIO, isDemo: true, message: "Unsupported file type, using demo portfolio" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { portfolio: DEMO_PORTFOLIO, isDemo: true, message: "Error processing file, using demo portfolio" },
      { status: 200 }
    );
  }
}
