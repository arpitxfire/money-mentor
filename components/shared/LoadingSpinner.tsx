"use client";

export default function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`${sizeMap[size]} border-2 border-navy-700 border-t-gold-400 rounded-full animate-spin ${className}`}
    />
  );
}
