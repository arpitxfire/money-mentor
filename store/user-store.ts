import { create } from "zustand";

interface UserProfile {
  name: string;
  age: number | null;
  monthlyIncome: number | null;
  riskProfile: "conservative" | "moderate" | "aggressive" | null;
  taxBracket: "5%" | "20%" | "30%" | null;
}

interface UserStore {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  name: "",
  age: null,
  monthlyIncome: null,
  riskProfile: null,
  taxBracket: null,
};

export const useUserStore = create<UserStore>((set) => ({
  profile: defaultProfile,
  setProfile: (profile) =>
    set((state) => ({ profile: { ...state.profile, ...profile } })),
  resetProfile: () => set({ profile: defaultProfile }),
}));
