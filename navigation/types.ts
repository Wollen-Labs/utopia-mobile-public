import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Tables } from 'utils/database.types';

// Auth Stack Types
export type AuthStackParamList = {
  Login: undefined;
  Verify: {
    type: 'email' | 'sms';
    contact: string;
  };
};

// Tab Navigator Types
export type TabParamList = {
  Events: undefined;
  Favourites: undefined;
  Bookings: undefined;
  Profile: undefined;
};

// Root Stack Types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
  Onboarding: undefined;
  Modal: undefined;
  EventDetails: {
    event: Partial<Tables<'event'>>;
  };
};

// Navigation Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabParamList> = NativeStackScreenProps<TabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
