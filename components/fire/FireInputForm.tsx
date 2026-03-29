"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FireInputs } from "@/types/fire";

const schema = z.object({
  currentAge: z.number().min(18).max(80),
  targetRetirementAge: z.number().min(30).max(85),
  monthlyIncome: z.number().min(1000),
  monthlyExpensesNow: z.number().min(1000),
  monthlyExpensesRetirement: z.number().min(1000),
  existingInvestments: z.number().min(0),
  expectedReturnRate: z.number().min(8).max(15),
  inflationRate: z.number().min(4).max(8),
  lifeExpectancy: z.number().min(70).max(100),
});

interface FireInputFormProps {
  onSubmit: (data: FireInputs) => void;
  isLoading: boolean;
}

const defaultValues: FireInputs = {
  currentAge: 30,
  targetRetirementAge: 55,
  monthlyIncome: 100000,
  monthlyExpensesNow: 60000,
  monthlyExpensesRetirement: 80000,
  existingInvestments: 500000,
  expectedReturnRate: 12,
  inflationRate: 6,
  lifeExpectancy: 85,
};

function SliderInput({
  label,
  name,
  min,
  max,
  step,
  value,
  onChange,
  suffix,
}: {
  label: string;
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-sm text-slate-400">{label}</label>
        <span className="text-sm font-mono text-gold-400">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold-400 cursor-pointer h-1.5"
        name={name}
      />
      <div className="flex justify-between text-xs text-slate-600 mt-0.5">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}

export default function FireInputForm({ onSubmit, isLoading }: FireInputFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FireInputs>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Current Age</label>
          <input
            {...register("currentAge", { valueAsNumber: true })}
            type="number"
            className="w-full bg-navy-700 border border-navy-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-400"
          />
          {errors.currentAge && <p className="text-red-400 text-xs mt-1">{errors.currentAge.message}</p>}
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Retirement Age</label>
          <input
            {...register("targetRetirementAge", { valueAsNumber: true })}
            type="number"
            className="w-full bg-navy-700 border border-navy-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block">Monthly Income (₹)</label>
        <input
          {...register("monthlyIncome", { valueAsNumber: true })}
          type="number"
          className="w-full bg-navy-700 border border-navy-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Monthly Expenses Now (₹)</label>
          <input
            {...register("monthlyExpensesNow", { valueAsNumber: true })}
            type="number"
            className="w-full bg-navy-700 border border-navy-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-400"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Monthly Expenses in Retirement (₹)</label>
          <input
            {...register("monthlyExpensesRetirement", { valueAsNumber: true })}
            type="number"
            className="w-full bg-navy-700 border border-navy-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block">Existing Investments/Savings (₹)</label>
        <input
          {...register("existingInvestments", { valueAsNumber: true })}
          type="number"
          className="w-full bg-navy-700 border border-navy-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-400"
        />
      </div>

      <div className="space-y-4 bg-navy-700/30 rounded-xl p-4">
        <SliderInput
          label="Expected Annual Return"
          name="expectedReturnRate"
          min={8}
          max={15}
          step={0.5}
          value={values.expectedReturnRate}
          onChange={(v) => setValue("expectedReturnRate", v)}
          suffix="%"
        />
        <SliderInput
          label="Expected Inflation Rate"
          name="inflationRate"
          min={4}
          max={8}
          step={0.5}
          value={values.inflationRate}
          onChange={(v) => setValue("inflationRate", v)}
          suffix="%"
        />
        <SliderInput
          label="Life Expectancy"
          name="lifeExpectancy"
          min={70}
          max={100}
          step={1}
          value={values.lifeExpectancy}
          onChange={(v) => setValue("lifeExpectancy", v)}
          suffix=" yrs"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-60 text-navy-950 font-semibold py-3 rounded-xl transition-colors"
      >
        {isLoading ? "Calculating..." : "Calculate FIRE Plan"}
      </button>
    </form>
  );
}
