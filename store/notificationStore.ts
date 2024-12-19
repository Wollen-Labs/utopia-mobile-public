import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface NotificationState {
  hasPromptedNotifications: boolean;
  lastNotificationPrompt: number | null;
  setHasPromptedNotifications: (value: boolean) => void;
  setLastNotificationPrompt: (value: number) => void;
  shouldShowNotificationPrompt: () => Promise<boolean>;
  deleteLastNotificationPrompt: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      hasPromptedNotifications: false,
      lastNotificationPrompt: null,

      setHasPromptedNotifications: (value: boolean) => {
        set({ hasPromptedNotifications: value });
      },

      setLastNotificationPrompt: (value: number) => {
        set({ lastNotificationPrompt: value });
      },

      deleteLastNotificationPrompt: () => {
        set({ lastNotificationPrompt: null });
      },

      shouldShowNotificationPrompt: async () => {
        const hasPrompted = get().hasPromptedNotifications;
        const lastPrompt = get().lastNotificationPrompt;

        if (hasPrompted) {
          return false;
        }

        if (!lastPrompt) {
          return true;
        }

        const lastPromptDate = new Date(lastPrompt);
        const now = new Date();
        const diffDays = Math.floor(
          (now.getTime() - lastPromptDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return diffDays >= 7;
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
