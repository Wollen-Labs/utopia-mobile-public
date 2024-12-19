import { createStackNavigator } from '@react-navigation/stack';

import { AuthStackParamList } from './types';
import Login from '../screens/auth/login';
import Verify from '../screens/auth/verify';

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Verify" component={Verify} />
    </Stack.Navigator>
  );
}
