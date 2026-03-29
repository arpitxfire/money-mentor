import { create } from "zustand";
import { Portfolio } from "@/types/portfolio";

interface PortfolioStore {
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  isDemo: boolean;
  setPortfolio: (portfolio: Portfolio, isDemo?: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  portfolio: null,
  isLoading: false,
  error: null,
  isDemo: false,
  setPortfolio: (portfolio, isDemo = false) =>
    set({ portfolio, isDemo, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ portfolio: null, isLoading: false, error: null, isDemo: false }),
}));
