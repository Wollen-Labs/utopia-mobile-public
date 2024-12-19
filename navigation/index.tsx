import {
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Unna_700Bold_Italic } from '@expo-google-fonts/unna';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import EventDetails from 'screens/event-details';
import Onboarding from 'screens/onboarding';
import { useOnboardingStore } from 'store/onboardingStore';
import { supabase } from 'utils/supabase';

import AuthNavigator from './auth-navigator';
import TabNavigator from './tab-navigator';
import { RootStackParamList } from './types';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

function Navigation() {
  const [state, setState] = useState<SessionState>({
    isAuthenticated: false,
    isLoading: true,
  });

  const [fontsLoaded] = useFonts({
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    Unna_700Bold_Italic,
  });

  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const needsToEditName = useOnboardingStore((state) => state.needsToEditName);

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState((prev) => ({
        ...prev,
        isAuthenticated: !!session,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!state.isLoading && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [state.isLoading, fontsLoaded]);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setState({
        isAuthenticated: !!session,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking session:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  if (state.isLoading || !fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!state.isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={Onboarding} />
        ) : (
          <>
            <Stack.Screen 
              name="Main" 
              component={TabNavigator}
              initialParams={needsToEditName ? { initialTab: 'Profile' } : undefined}
            />
            <Stack.Screen
              name="EventDetails"
              component={EventDetails}
              options={{
                headerShown: false,
                presentation: 'transparentModal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function RootStack() {
  return <Navigation />;
}
