"use client";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  color?: "gold" | "emerald" | "red" | "blue";
  height?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const colorMap = {
  gold: "bg-gold-400",
  emerald: "bg-emerald-400",
  red: "bg-red-400",
  blue: "bg-blue-400",
};

const heightMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export default function ProgressBar({
  value,
  label,
  showValue = false,
  color = "gold",
  height = "md",
  className = "",
  animated = false,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-slate-400">{label}</span>}
          {showValue && (
            <span className="text-sm font-mono text-slate-300">
              {clampedValue.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-navy-700 rounded-full ${heightMap[height]} overflow-hidden`}>
        <div
          className={`${heightMap[height]} ${colorMap[color]} rounded-full transition-all duration-500 ${
            animated ? "animate-pulse" : ""
          }`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
