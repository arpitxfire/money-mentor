"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import AIInsightBox from "@/components/shared/AIInsightBox";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const LIFE_EVENTS = [
  {
    id: "bonus",
    emoji: "💰",
    title: "Bonus Received",
    description: "Got a performance bonus or windfall. Allocate it wisely.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    id: "marriage",
    emoji: "💍",
    title: "Getting Married",
    description: "Combine finances, joint goals, insurance review.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    id: "baby",
    emoji: "👶",
    title: "New Baby",
    description: "Education fund, increased insurance, revised budget.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: "inheritance",
    emoji: "🏛️",
    title: "Inheritance",
    description: "Received a large sum. Invest it without emotions.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    id: "job-loss",
    emoji: "⚡",
    title: "Job Loss",
    description: "Emergency fund, reduced expenses, upskilling plan.",
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    id: "home-buying",
    emoji: "🏡",
    title: "Buying a Home",
    description: "Down payment, EMI planning, tax benefits.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

const PROFILE_QUESTIONS = [
  {
    id: "incomeRange",
    question: "What is your annual income?",
    options: [
      "Less than ₹5 LPA",
      "₹5-10 LPA",
      "₹10-20 LPA",
      "₹20-50 LPA",
      "₹50 LPA+",
    ],
  },
  {
    id: "riskAppetite",
    question: "What is your risk appetite?",
    options: [
      "Conservative (FD, debt funds)",
      "Moderate (balanced portfolio)",
      "Aggressive (equity-heavy)",
    ],
  },
  {
    id: "existingInvestments",
    question: "What is your existing investment portfolio size?",
    options: [
      "Less than ₹1 lakh",
      "₹1-10 lakh",
      "₹10-50 lakh",
      "₹50 lakh - ₹1 crore",
      "More than ₹1 crore",
    ],
  },
];

type Step = "select-event" | "profile" | "results";

export default function LifeEventsPage() {
  const [step, setStep] = useState<Step>("select-event");
  const [selectedEvent, setSelectedEvent] = useState<(typeof LIFE_EVENTS)[0] | null>(null);
  const [profileAnswers, setProfileAnswers] = useState<Record<string, string>>({});
  const [currentProfileQ, setCurrentProfileQ] = useState(0);

  const handleSelectEvent = (event: (typeof LIFE_EVENTS)[0]) => {
    setSelectedEvent(event);
    setStep("profile");
    setCurrentProfileQ(0);
    setProfileAnswers({});
  };

  const handleProfileAnswer = (answer: string) => {
    const question = PROFILE_QUESTIONS[currentProfileQ];
    const newAnswers = { ...profileAnswers, [question.id]: answer };
    setProfileAnswers(newAnswers);

    if (currentProfileQ < PROFILE_QUESTIONS.length - 1) {
      setCurrentProfileQ(currentProfileQ + 1);
    } else {
      setStep("results");
    }
  };

  const handleReset = () => {
    setStep("select-event");
    setSelectedEvent(null);
    setProfileAnswers({});
    setCurrentProfileQ(0);
  };

  return (
    <PageWrapper title="Life Events Advisor" subtitle="Customized financial plan for life's big moments">
      <AnimatePresence mode="wait">
        {step === "select-event" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="font-display text-2xl font-semibold text-white mb-2">
              What&apos;s happening in your life?
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Select a life event to get a personalized financial action plan
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LIFE_EVENTS.map((event) => (
                <motion.button
                  key={event.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleSelectEvent(event)}
                  className="text-left bg-navy-800 border border-navy-700 hover:border-gold-400/40 rounded-xl p-6 transition-all group"
                >
                  <div className={`text-3xl mb-3 ${event.bg} w-14 h-14 rounded-xl flex items-center justify-center`}>
                    {event.emoji}
                  </div>
                  <h3 className={`font-display text-lg font-semibold mb-1.5 group-hover:text-gold-400 transition-colors ${event.color}`}>
                    {event.title}
                  </h3>
                  <p className="text-slate-500 text-sm">{event.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-slate-600 group-hover:text-gold-400 text-xs transition-colors">
                    <span>Get Action Plan</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "profile" && selectedEvent && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 ${selectedEvent.bg} rounded-xl flex items-center justify-center text-2xl`}>
                {selectedEvent.emoji}
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-white">{selectedEvent.title}</h2>
                <p className="text-slate-500 text-sm">Quick profile to personalize your plan</p>
              </div>
            </div>

            <div className="bg-navy-800 border border-navy-700 border-t-2 border-t-gold-400 rounded-xl p-6">
              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-1.5">
                  Question {currentProfileQ + 1} of {PROFILE_QUESTIONS.length}
                </div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {PROFILE_QUESTIONS[currentProfileQ].question}
                </h3>
              </div>

              <div className="space-y-2.5">
                {PROFILE_QUESTIONS[currentProfileQ].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleProfileAnswer(option)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-navy-600 bg-navy-700/50 text-slate-300 hover:border-gold-400/50 hover:text-white text-sm transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="mt-4 text-slate-600 hover:text-slate-400 text-sm"
            >
              ← Back to events
            </button>
          </motion.div>
        )}

        {step === "results" && selectedEvent && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 ${selectedEvent.bg} rounded-xl flex items-center justify-center text-3xl`}>
                {selectedEvent.emoji}
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-white">
                  {selectedEvent.title} — Action Plan
                </h2>
                <p className="text-slate-500 text-sm">
                  {profileAnswers.incomeRange} · {profileAnswers.riskAppetite}
                </p>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(profileAnswers).map(([key, val]) => (
                <span key={key} className="bg-navy-800 border border-navy-700 text-slate-300 text-xs px-3 py-1.5 rounded-full">
                  {val}
                </span>
              ))}
            </div>

            {/* AI Action Plan */}
            <AIInsightBox
              feature="life-event"
              data={{
                event: selectedEvent.title,
                incomeRange: profileAnswers.incomeRange,
                riskAppetite: profileAnswers.riskAppetite,
                existingInvestments: profileAnswers.existingInvestments,
                context: `Life event: ${selectedEvent.title}. ${selectedEvent.description}`,
              }}
              title={`🎯 Financial Action Plan — ${selectedEvent.title}`}
            />

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-navy-800 border border-navy-700 hover:bg-navy-700 text-slate-300 font-medium py-3 rounded-xl transition-colors text-sm"
              >
                Choose Different Event
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
