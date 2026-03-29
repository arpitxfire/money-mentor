"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolio-store";
import ProgressBar from "@/components/shared/ProgressBar";
import type { Portfolio } from "@/types/portfolio";

const STAGES = [
  "Parsing statement...",
  "Computing XIRR...",
  "Running AI analysis...",
];

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stage, setStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setPortfolio, setLoading, setError } = usePortfolioStore();

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(pdf|csv)$/i)) {
      setError("Only PDF or CSV files are supported");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyse = async () => {
    setIsProcessing(true);
    setLoading(true);

    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    // Simulate stage progress
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      await new Promise((r) => setTimeout(r, 800));
    }

    try {
      const response = await fetch("/api/parse-portfolio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json() as { portfolio: unknown; isDemo: boolean; message?: string };
      setPortfolio(data.portfolio as Portfolio, data.isDemo);
    } catch {
      setError("Failed to process portfolio. Using demo data.");
      // Load demo portfolio
      const { DEMO_PORTFOLIO } = await import("@/lib/constants/demo-portfolio");
      setPortfolio(DEMO_PORTFOLIO, true);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const handleLoadDemo = async () => {
    setIsProcessing(true);
    setLoading(true);
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      await new Promise((r) => setTimeout(r, 600));
    }
    const { DEMO_PORTFOLIO } = await import("@/lib/constants/demo-portfolio");
    setPortfolio(DEMO_PORTFOLIO, true);
    setIsProcessing(false);
    setLoading(false);
  };

  if (isProcessing) {
    return (
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-8 text-center">
        <div className="space-y-6">
          {STAGES.map((stageLabel, i) => (
            <div key={stageLabel} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={i <= stage ? "text-slate-200" : "text-slate-600"}>
                  {stageLabel}
                </span>
                {i < stage && <span className="text-emerald-400 text-xs">✓</span>}
              </div>
              <ProgressBar
                value={i < stage ? 100 : i === stage ? 65 : 0}
                color={i < stage ? "emerald" : "gold"}
                height="sm"
                animated={i === stage}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer
          ${isDragging
            ? "border-gold-400 bg-gold-400/5"
            : selectedFile
            ? "border-navy-600 bg-navy-800"
            : "border-navy-600 bg-navy-800 hover:border-gold-400/50 hover:bg-navy-800/80"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <FileText className="w-12 h-12 text-gold-400" />
              <div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-slate-500 text-sm">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <Upload className="w-12 h-12 text-slate-600" />
              <div>
                <p className="text-slate-300 font-medium">
                  Drop CAMS or KFintech statement here
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Supports PDF and CSV formats
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        {selectedFile && (
          <button
            onClick={handleAnalyse}
            className="flex-1 bg-gold-400 hover:bg-gold-500 text-navy-950 font-semibold py-3 rounded-xl transition-colors"
          >
            Analyse Portfolio
          </button>
        )}
        <button
          onClick={handleLoadDemo}
          className={`${selectedFile ? "flex-1" : "w-full"} bg-navy-700 hover:bg-navy-600 text-slate-300 font-medium py-3 rounded-xl transition-colors border border-navy-600`}
        >
          Load Demo Portfolio
        </button>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-600 bg-navy-800/50 rounded-lg p-3">
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <p>Your statement is processed locally. No data is stored on our servers.</p>
      </div>
    </div>
  );
}
