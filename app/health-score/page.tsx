"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import AIInsightBox from "@/components/shared/AIInsightBox";
import ScoreBadge from "@/components/shared/ScoreBadge";
import ProgressBar from "@/components/shared/ProgressBar";
import { HEALTH_QUESTIONS } from "@/lib/constants/health-questions";
import { calculateHealthScore } from "@/lib/calculations/health-score";
import { HealthScoreResult } from "@/types/health";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import NumberTicker from "@/components/shared/NumberTicker";

export default function HealthScorePage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<HealthScoreResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const question = HEALTH_QUESTIONS[currentQ];
  const totalQuestions = HEALTH_QUESTIONS.length;
  const progress = (currentQ / totalQuestions) * 100;
  const isAnswered = answers[question.id] !== undefined;

  const handleAnswer = (score: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: score }));
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate results
      const score = calculateHealthScore(answers);
      setResults(score);
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleReset = () => {
    setCurrentQ(0);
    setAnswers({});
    setResults(null);
    setShowResults(false);
  };

  if (showResults && results) {
    const radarData = results.dimensionScores.map((d) => ({
      dimension: d.label.replace(" ", "\n"),
      score: d.score,
    }));

    return (
      <PageWrapper title="Money Health Score" subtitle="Your financial health assessment">
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-navy-800 border border-navy-700 rounded-xl p-8 flex flex-col items-center justify-center min-w-[200px]">
              <div className="text-slate-400 text-sm mb-2">Overall Score</div>
              <div
                className={`font-display text-7xl font-bold mb-2 ${
                  results.overallScore >= 75
                    ? "text-emerald-400"
                    : results.overallScore >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                <NumberTicker value={results.overallScore} duration={1500} />
              </div>
              <ScoreBadge score={results.overallScore} size="lg" />
              <p className="text-slate-500 text-xs mt-3 text-center">Out of 100</p>
            </div>

            {/* Radar Chart */}
            <div className="flex-1 bg-navy-800 border border-navy-700 rounded-xl p-5">
              <h3 className="text-slate-300 font-medium mb-3">Score by Dimension</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1A3360" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fill: "#64748B", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "#64748B", fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#F5C842"
                    fill="#F5C842"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0D2040", border: "1px solid #1A3360", borderRadius: "8px" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dimension Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.dimensionScores.map((dim) => (
              <div
                key={dim.dimension}
                className="bg-navy-800 border border-navy-700 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-200 text-sm">{dim.label}</h4>
                  <ScoreBadge score={dim.score} size="sm" showLabel={false} />
                </div>
                <ProgressBar
                  value={dim.score}
                  color={dim.score >= 70 ? "emerald" : dim.score >= 40 ? "gold" : "red"}
                  height="md"
                  className="mb-3"
                />
                <p className="text-slate-500 text-xs mb-3">{dim.diagnosis}</p>
                <ul className="space-y-1">
                  {dim.actionItems.slice(0, 2).map((action, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                      <CheckCircle className="w-3 h-3 text-gold-400 mt-0.5 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <AIInsightBox
            feature="health"
            data={{
              overallScore: results.overallScore,
              dimensionScores: results.dimensionScores.map((d) => ({
                label: d.label,
                score: d.score,
                diagnosis: d.diagnosis,
              })),
            }}
            title="💯 AI Health Coach"
          />

          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-300 text-sm underline transition-colors"
            >
              Retake questionnaire
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Money Health Score" subtitle="5-minute financial health check">
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Question {currentQ + 1} of {totalQuestions}</span>
            <span>{question.dimension.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</span>
          </div>
          <ProgressBar value={progress} color="gold" height="sm" />
        </div>

        {/* Question Card */}
        <div className="bg-navy-800 border border-navy-700 border-t-2 border-t-gold-400 rounded-xl p-6 mb-4">
          <h2 className="font-display text-xl font-semibold text-white mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.score;
              return (
                <button
                  key={option.text}
                  onClick={() => handleAnswer(option.score)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150
                    ${
                      isSelected
                        ? "border-gold-400 bg-gold-400/10 text-white"
                        : "border-navy-600 bg-navy-700/50 text-slate-300 hover:border-navy-500 hover:bg-navy-700"
                    }`}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQ === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-navy-800 border border-navy-700 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-40 text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex-1 bg-gold-400 hover:bg-gold-500 disabled:opacity-40 text-navy-950 font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5"
          >
            {currentQ === totalQuestions - 1 ? "See My Score" : "Next Question"}
            {currentQ < totalQuestions - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
