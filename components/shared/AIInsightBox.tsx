"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { RefreshCw, Brain } from "lucide-react";

interface AIInsightBoxProps {
  feature: string;
  data: Record<string, unknown>;
  title?: string;
  className?: string;
}

export default function AIInsightBox({
  feature,
  data,
  title = "AI Insight",
  className = "",
}: AIInsightBoxProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchInsight = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setContent("");
    setError(null);

    try {
      const response = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature, data, stream: true }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI insight");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setContent(accumulated);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Unable to load AI insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      fetchInsight();
    }
    return () => {
      abortControllerRef.current?.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`bg-navy-800 border border-navy-700 border-t-2 border-t-gold-400 rounded-xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-gold-400" />
          <h3 className="font-display text-lg font-semibold text-gold-400">
            {title}
          </h3>
        </div>
        <button
          onClick={fetchInsight}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-gold-400 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Analyzing..." : "Regenerate"}
        </button>
      </div>

      {isLoading && !content && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-navy-700 rounded animate-pulse"
              style={{ width: `${85 - i * 10}%` }}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3">
          {error}
        </div>
      )}

      {content && (
        <div className="prose prose-invert prose-sm max-w-none text-slate-300">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-gold-400 font-display text-base font-semibold mt-4 mb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-slate-200 font-semibold mt-3 mb-1">
                  {children}
                </h3>
              ),
              strong: ({ children }) => (
                <strong className="text-slate-100 font-semibold">{children}</strong>
              ),
              li: ({ children }) => (
                <li className="text-slate-300 my-0.5">{children}</li>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 mb-2">{children}</p>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
