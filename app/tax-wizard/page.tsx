"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageWrapper from "@/components/layout/PageWrapper";
import AIInsightBox from "@/components/shared/AIInsightBox";
import { TaxInputs, TaxComparison } from "@/types/tax";
import { compareTaxRegimes } from "@/lib/calculations/tax";
import { formatCurrency } from "@/lib/utils/formatters";
import { CheckCircle, XCircle, TrendingUp, AlertCircle } from "lucide-react";

const schema = z.object({
  grossSalary: z.number().min(0),
  hraReceived: z.number().min(0),
  rentPaid: z.number().min(0),
  cityType: z.enum(["metro", "non-metro"]),
  investments80C: z.number().min(0),
  investments80D: z.number().min(0),
  npsContribution: z.number().min(0),
  homeLoanInterest: z.number().min(0),
  otherIncome: z.number().min(0),
});

const defaultValues: TaxInputs = {
  grossSalary: 1200000,
  hraReceived: 200000,
  rentPaid: 180000,
  cityType: "metro",
  investments80C: 150000,
  investments80D: 0,
  npsContribution: 0,
  homeLoanInterest: 0,
  otherIncome: 0,
};

interface InputFieldProps {
  label: string;
  name: keyof TaxInputs;
  register: ReturnType<typeof useForm<TaxInputs>>["register"];
  prefix?: string;
  type?: string;
  options?: { value: string; label: string }[];
}

function InputField({ label, name, register, prefix, type = "number", options }: InputFieldProps) {
  return (
    <div>
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      {options ? (
        <select
          {...register(name)}
          className="w-full bg-navy-700 border border-navy-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-400"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              {prefix}
            </span>
          )}
          <input
            {...register(name, { valueAsNumber: type === "number" })}
            type={type}
            className={`w-full bg-navy-700 border border-navy-600 rounded-lg py-2 text-white text-sm focus:outline-none focus:border-gold-400 ${prefix ? "pl-6 pr-3" : "px-3"}`}
          />
        </div>
      )}
    </div>
  );
}

export default function TaxWizardPage() {
  const [comparison, setComparison] = useState<TaxComparison | null>(null);
  const [inputs, setInputs] = useState<TaxInputs | null>(null);

  const { register, handleSubmit } = useForm<TaxInputs>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: TaxInputs) => {
    const result = compareTaxRegimes(data);
    setComparison(result);
    setInputs(data);
  };

  return (
    <PageWrapper title="Tax Wizard" subtitle="Old Regime vs New Regime — FY 2025-26">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Input Form */}
        <div className="w-full md:w-[40%] shrink-0">
          <div className="bg-navy-800 border border-navy-700 border-t-2 border-t-gold-400 rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold text-white mb-4">
              Income Details
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <InputField label="Gross CTC / Annual Salary (₹)" name="grossSalary" register={register} prefix="₹" />
              <InputField label="HRA Received (₹/year)" name="hraReceived" register={register} prefix="₹" />
              <InputField label="Rent Paid (₹/year)" name="rentPaid" register={register} prefix="₹" />
              <InputField
                label="City Type"
                name="cityType"
                register={register}
                options={[
                  { value: "metro", label: "Metro (Mumbai, Delhi, Chennai, Kolkata)" },
                  { value: "non-metro", label: "Non-Metro" },
                ]}
              />

              <div className="pt-2 border-t border-navy-700">
                <p className="text-xs text-slate-500 mb-2">Old Regime Deductions</p>
                <div className="space-y-2">
                  <InputField label="80C Investments (ELSS, PPF, LIC, etc.)" name="investments80C" register={register} prefix="₹" />
                  <InputField label="80D — Health Insurance Premium" name="investments80D" register={register} prefix="₹" />
                  <InputField label="NPS Contribution (80CCD 1B)" name="npsContribution" register={register} prefix="₹" />
                  <InputField label="Home Loan Interest (Section 24B)" name="homeLoanInterest" register={register} prefix="₹" />
                </div>
              </div>

              <InputField label="Other Income (FD interest, capital gains, etc.)" name="otherIncome" register={register} prefix="₹" />

              <button
                type="submit"
                className="w-full bg-gold-400 hover:bg-gold-500 text-navy-950 font-semibold py-3 rounded-xl transition-colors mt-2"
              >
                Calculate Tax
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 space-y-5">
          {!comparison && (
            <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
              Enter your income details to compare tax regimes
            </div>
          )}

          {comparison && inputs && (
            <>
              {/* Better Regime Banner */}
              <div
                className={`flex items-center gap-3 rounded-xl px-5 py-4 border ${
                  comparison.betterRegime === "new"
                    ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
                    : "bg-gold-400/10 border-gold-400/30 text-gold-400"
                }`}
              >
                <TrendingUp className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">
                    {comparison.betterRegime === "new" ? "New Regime" : "Old Regime"} saves you{" "}
                    <strong>{formatCurrency(comparison.taxSaved)}</strong> more tax
                  </p>
                  <p className="text-sm opacity-80 mt-0.5">
                    Switch to the{" "}
                    {comparison.betterRegime === "new" ? "new" : "old"} regime in your
                    Form 12BB or ITR filing.
                  </p>
                </div>
              </div>

              {/* Side by Side Comparison */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Old Regime", data: comparison.oldRegime, isWinner: comparison.betterRegime === "old" },
                  { label: "New Regime", data: comparison.newRegime, isWinner: comparison.betterRegime === "new" },
                ].map(({ label, data, isWinner }) => (
                  <div
                    key={label}
                    className={`bg-navy-800 border rounded-xl p-5 ${
                      isWinner ? "border-emerald-400/40 border-t-2 border-t-emerald-400" : "border-navy-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-semibold text-white">{label}</h3>
                      {isWinner ? (
                        <span className="text-xs bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded-full">Better ✓</span>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        {[
                          ["Gross Income", formatCurrency(data.grossIncome)],
                          ["Total Deductions", `- ${formatCurrency(data.totalDeductions)}`],
                          ["Taxable Income", formatCurrency(data.taxableIncome)],
                          ["Tax (before cess)", formatCurrency(data.taxBeforeCess)],
                          ["4% Cess", formatCurrency(data.cess)],
                          ["Total Tax", formatCurrency(data.totalTax)],
                          ["Effective Rate", `${data.effectiveTaxRate.toFixed(1)}%`],
                          ["In-hand Salary", formatCurrency(data.inHandSalary)],
                        ].map(([key, val]) => (
                          <tr key={key} className="border-b border-navy-700/40">
                            <td className="py-1.5 text-slate-500">{key}</td>
                            <td className="py-1.5 text-right font-mono text-slate-200">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Missing Deductions */}
              {comparison.missingDeductions.length > 0 && (
                <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
                  <h3 className="font-display text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Missing Deductions (Old Regime)
                  </h3>
                  <div className="space-y-3">
                    {comparison.missingDeductions.map((d) => (
                      <div key={d.name} className="flex items-center justify-between py-2 border-b border-navy-700/40">
                        <div>
                          <p className="text-slate-200 text-sm font-medium">{d.name}</p>
                          <p className="text-slate-600 text-xs">Section {d.section} · Max: {formatCurrency(d.maxAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 text-sm font-mono font-medium">
                            Save up to {formatCurrency(d.potentialSaving)}
                          </p>
                          <p className="text-slate-600 text-xs">Unused: {formatCurrency(d.maxAmount - d.currentAmount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insight */}
              <AIInsightBox
                feature="tax"
                data={{
                  grossSalary: inputs.grossSalary,
                  oldRegimeTax: comparison.oldRegime.totalTax,
                  newRegimeTax: comparison.newRegime.totalTax,
                  betterRegime: comparison.betterRegime,
                  taxSaved: comparison.taxSaved,
                  missingDeductions: comparison.missingDeductions,
                }}
                title="🧾 AI Tax Advisor"
              />
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
