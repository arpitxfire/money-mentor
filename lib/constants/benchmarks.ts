export interface BenchmarkData {
  name: string;
  ticker: string;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  tenYearReturn: number;
  cagr: number; // long-term CAGR used for comparisons
}

export const BENCHMARKS: BenchmarkData[] = [
  {
    name: "Nifty 50",
    ticker: "NIFTY50",
    oneYearReturn: 17.2,
    threeYearReturn: 13.4,
    fiveYearReturn: 14.8,
    tenYearReturn: 12.8,
    cagr: 12,
  },
  {
    name: "Nifty 500",
    ticker: "NIFTY500",
    oneYearReturn: 20.1,
    threeYearReturn: 16.2,
    fiveYearReturn: 16.9,
    tenYearReturn: 13.6,
    cagr: 13,
  },
  {
    name: "Nifty Midcap 150",
    ticker: "NIFTYMIDCAP150",
    oneYearReturn: 28.4,
    threeYearReturn: 24.6,
    fiveYearReturn: 22.3,
    tenYearReturn: 16.8,
    cagr: 15,
  },
  {
    name: "Nifty Smallcap 250",
    ticker: "NIFTYSMALLCAP250",
    oneYearReturn: 32.1,
    threeYearReturn: 27.8,
    fiveYearReturn: 24.1,
    tenYearReturn: 15.2,
    cagr: 14,
  },
];

export const DEFAULT_BENCHMARK = BENCHMARKS[0]; // Nifty 50
export const NIFTY50_CAGR = 12; // Long-term CAGR used as benchmark
