import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import ListScreenWrapper from 'components/ListScreenWrapper';
import { ScreenContent } from 'components/ScreenContent';
import SmallBookingCard from 'components/SmallBookingCard';
import { useFavorites } from 'hooks/useFavorites';
import { RootStackParamList } from 'navigation/types';
import { Text } from 'react-native';

export default function Favourites({
  navigation,
}: {
  navigation: BottomTabNavigationProp<RootStackParamList>;
}) {
  const { data, isLoading } = useFavorites();


  if (isLoading && !data) {
    return (
      <ScreenContent>
        <Text>Loading...</Text>
      </ScreenContent>
    );
  }


  return (
    <ListScreenWrapper
      title="My Favourites"
      length={data?.length ?? 0}
      data={data ?? []}
      renderItem={({ item }) => <SmallBookingCard showFavouriteButton {...item} />}
      keyExtractor={(item) => item.id.toString()}
      emptyListText="No favourites to display"
      onEndReached={() => {}}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
