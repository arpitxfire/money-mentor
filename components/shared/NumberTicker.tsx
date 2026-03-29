"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/utils/formatters";

interface NumberTickerProps {
  value: number;
  duration?: number;
  format?: "currency" | "percentage" | "number";
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function NumberTicker({
  value,
  duration = 1500,
  format = "number",
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current =
        startValueRef.current + (value - startValueRef.current) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatValue = (val: number): string => {
    if (format === "currency") {
      return formatCurrency(val);
    }
    if (format === "percentage") {
      return `${prefix}${val.toFixed(decimals)}%${suffix}`;
    }
    return `${prefix}${val.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  };

  return <span className={className}>{formatValue(displayValue)}</span>;
}
