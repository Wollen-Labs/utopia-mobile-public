import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserHeader } from 'components/UserHeader';
import Favourites from 'screens/favourites';
import Profile from 'screens/profile';

import { TabParamList, RootStackScreenProps } from './types';
import Bookings from '../screens/bookings';
import Events from '../screens/events';

type Props = RootStackScreenProps<'Main'>;

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator({ navigation, route }: Props) {
  const initialTab = route.params?.initialTab;

  return (
    <Tab.Navigator
      initialRouteName={initialTab || 'Events'}
      screenOptions={{
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#101010',
          borderTopWidth: 0.5,
          borderTopColor: '#1C1C1C',
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerShadowVisible: false,
      }}>
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="sparkles" size={24} color={color} />,
          header: (props) => <UserHeader {...props} />,
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={Favourites}
        options={{
          header: (props) => <UserHeader {...props} />,
          tabBarIcon: ({ color }) => <FontAwesome5 name="heart" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          header: (props) => <UserHeader {...props} />,
          tabBarIcon: ({ color }) => <FontAwesome5 name="check" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
