import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  needsToEditName: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  setNeedsToEditName: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      needsToEditName: true,
      setHasCompletedOnboarding: (value: boolean) => set({ hasCompletedOnboarding: value }),
      setNeedsToEditName: (value: boolean) => set({ needsToEditName: value }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 