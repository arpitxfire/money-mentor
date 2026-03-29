# MoneyMentor AI 🇮🇳

**AI-Powered Personal Finance Mentor for Indian Retail Investors**

> ET AI Hackathon 2026 — PS 9 Submission

## Overview

MoneyMentor AI is a production-ready web application that provides professional-grade financial analysis and advice powered by Claude AI (Anthropic). It's built specifically for Indian retail investors with Indian tax laws, mutual fund categories, and ₹ formatting.

## Features

### 📊 Portfolio X-Ray
- Upload CAMS or KFintech PDF/CSV statement
- Computes true XIRR per fund using Newton-Raphson algorithm
- Portfolio overlap matrix, expense ratio analysis
- Benchmark comparison against Nifty 50 (12% CAGR)
- AI rebalancing recommendations via Claude

### 🔥 FIRE Planner
- Calculate corpus needed using the 4% withdrawal rule
- Monthly SIP computation (PMT formula)
- Year-by-year projection with inflation adjustment
- Asset allocation glide path (equity% = 100 - age)
- AI FIRE coaching via Claude

### 💯 Money Health Score
- 15-question financial health assessment
- 6 dimensions: Emergency Fund, Insurance, Diversification, Debt, Tax, Retirement
- Radar chart visualization
- Specific action items per dimension

### 🧾 Tax Wizard (FY 2025-26)
- Old Regime vs New Regime comparison
- HRA exemption calculation
- Section 80C, 80D, 80CCD(1B), Section 24B deductions
- Section 87A rebate (new: full rebate up to ₹12L)
- Missing deductions analysis

### 🎯 Life Events Advisor
- 6 events: Bonus, Marriage, Baby, Inheritance, Job Loss, Home Buying
- Risk profiler (3 questions)
- AI-generated action plan via Claude

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| State | Zustand |
| AI | Anthropic Claude (claude-sonnet-4-5) |
| PDF | pdf-parse |
| CSV | Papa Parse |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `NEXT_PUBLIC_APP_URL` | App URL (default: http://localhost:3000) |

## Architecture

```
app/
├── page.tsx                 # Landing page
├── layout.tsx               # Root layout with sidebar
├── portfolio-xray/          # Feature 1
├── fire-planner/            # Feature 2
├── health-score/            # Feature 3
├── tax-wizard/              # Feature 4
├── life-events/             # Feature 5
└── api/                     # Next.js API routes

lib/
├── calculations/            # Pure math functions
├── parsers/                 # File parsers
├── ai/                      # AI integration
└── constants/               # Static data
```

## Deployment

Deploy to Vercel — add `ANTHROPIC_API_KEY` as environment variable.

## Disclaimer

MoneyMentor AI is for educational purposes only. It is not a SEBI-registered investment advisor. Do not make financial decisions solely based on this tool.

---

Built with ❤️ for Indian retail investors | ET AI Hackathon 2026