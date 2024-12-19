import { useQueryClient } from '@tanstack/react-query';
import { FAVORITES_QUERY_KEY } from 'hooks/useFavorites';
import Ionicons from '@expo/vector-icons/Ionicons';
import EventCardBottomInfo from 'components/EventCardBottomInfo';
import { FONTS } from 'constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { EventImage } from 'utils/database.types';
import { supabase } from 'utils/supabase';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.22;
const CARD_WIDTH = SCREEN_WIDTH - 32;

export default function SmallBookingCard({
  id,
  title,
  points,
  location,
  start_date,
  images,
  showFavouriteButton,
}: {
  id: string;
  title: string;
  points: number;
  location: string;
  start_date: string;
  images: EventImage[];
  showFavouriteButton?: boolean;
}) {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const handleRemoveFavourite = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await supabase
        .from('favorite_events')
        .delete()
        .eq('user_id', session?.user.id as string)
        .eq('event_id', id);

      await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };
  return (
    <View style={styles.renderCardContainer}>
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.navigate('EventDetails', { event: { id } })}>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0)',
            'rgba(0, 0, 0, 0.3)',
            'rgba(0, 0, 0, 0.5)',
            'rgba(0, 0, 0, 0.8)',
          ]}
          style={styles.gradient}
        />
        <Image source={{ uri: images[0].url }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.eventTitle}>{title}</Text>
          <EventCardBottomInfo points={points} location={location} date={start_date} />
        </View>
        {showFavouriteButton ? (
          <TouchableOpacity style={styles.favButton} onPress={handleRemoveFavourite}>
            <Ionicons name="heart-circle" size={50} color="white" />
          </TouchableOpacity>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  renderCardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#101010',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#343434',
  },
  pressable: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    overflow: 'hidden',
    zIndex: -2,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  eventTitle: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontFamily: FONTS.BOLD,
    color: 'white',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: -1,
  },
  favButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 16,
  },
});
