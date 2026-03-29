"use client";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Average";
  if (score >= 35) return "Needs Work";
  return "Critical";
}

function getScoreColors(score: number): { bg: string; text: string; border: string } {
  if (score >= 80) return { bg: "bg-emerald-400/15", text: "text-emerald-400", border: "border-emerald-400/40" };
  if (score >= 65) return { bg: "bg-green-400/15", text: "text-green-400", border: "border-green-400/40" };
  if (score >= 50) return { bg: "bg-yellow-400/15", text: "text-yellow-400", border: "border-yellow-400/40" };
  if (score >= 35) return { bg: "bg-orange-400/15", text: "text-orange-400", border: "border-orange-400/40" };
  return { bg: "bg-red-400/15", text: "text-red-400", border: "border-red-400/40" };
}

const sizeMap = {
  sm: { badge: "px-2 py-0.5 text-xs", score: "text-xs" },
  md: { badge: "px-3 py-1 text-sm", score: "text-sm" },
  lg: { badge: "px-4 py-1.5 text-base", score: "text-base" },
};

export default function ScoreBadge({ score, size = "md", showLabel = true, className = "" }: ScoreBadgeProps) {
  const colors = getScoreColors(score);
  const sizes = sizeMap[size];
  const label = getScoreLabel(score);

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${colors.bg} ${colors.text} border ${colors.border} rounded-full font-medium ${sizes.badge} ${className}`}
    >
      <span className={`font-mono font-bold ${sizes.score}`}>{score}</span>
      {showLabel && <span>{label}</span>}
    </span>
  );
}
