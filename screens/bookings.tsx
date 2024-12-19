import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import ListScreenWrapper from 'components/ListScreenWrapper';
import { ScreenContent } from 'components/ScreenContent';
import SmallBookingCard from 'components/SmallBookingCard';
import { useBookings } from 'hooks/useBookings';
import { RootStackParamList } from 'navigation/types';
import { Text } from 'react-native';

export default function Bookings({
  navigation,
}: {
  navigation: BottomTabNavigationProp<RootStackParamList>;
}) {
  const { data, isLoading } = useBookings();

  if (isLoading && !data) {
    return (
      <ScreenContent>
        <Text>Loading...</Text>
      </ScreenContent>
    );
  }

  return (
    <ListScreenWrapper
      title="Bookings"
      length={data?.length ?? 0}
      data={data ?? []}
      emptyListText="No bookings to display"
      renderItem={({ item }) => <SmallBookingCard {...item} />}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => {}}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
