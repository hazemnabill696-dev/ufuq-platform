"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
  learningSupport: boolean;
  setLearningSupport: (value: boolean) => void;
  toggleLearningSupport: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      learningSupport: false,
      setLearningSupport: (value) => set({ learningSupport: value }),
      toggleLearningSupport: () => set((s) => ({ learningSupport: !s.learningSupport })),
    }),
    {
      name: "ufuq-user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
