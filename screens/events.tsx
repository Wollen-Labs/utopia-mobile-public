import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useQueryClient } from '@tanstack/react-query';
import EventCardBottomInfo from 'components/EventCardBottomInfo';
import { NotificationPrompt } from 'components/NotificationPrompt';
import { ScreenContent } from 'components/ScreenContent';
import { FONTS } from 'constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { useEvents, Event } from 'hooks/useEvents';
import { FAVORITES_QUERY_KEY } from 'hooks/useFavorites';
import { RootStackParamList } from 'navigation/types';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';
import { useSwiperStore } from 'store/swiperStore';
import { supabase } from 'utils/supabase';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;
const CARD_WIDTH = SCREEN_WIDTH * 0.9;

export default function Events({
  navigation,
}: {
  navigation: BottomTabNavigationProp<RootStackParamList>;
}) {
  const [swipeAll, setSwipeAll] = useState(false);

  const { data, fetchNextPage, hasNextPage, isLoading } = useEvents();
  const events = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flat();
  }, [data]);
  const ref = useRef<SwiperCardRefType>();
  const setSwiperRef = useSwiperStore((state) => state.setSwiperRef);
  const queryClient = useQueryClient();

  useEffect(() => {
    setSwiperRef(ref);
  }, []);

  const handleIndexChange = useCallback(
    (index: number) => {
      if (index === events.length - 3 && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    [events.length, hasNextPage, isLoading, data, fetchNextPage]
  );

  const renderCard = useCallback(
    (event: Event) => {
      return (
        <AnimatedPressable
          style={styles.renderCardContainer}
          onPress={() => navigation.navigate('EventDetails', { event })}>
          <AnimatedLinearGradient
            colors={[
              'rgba(0, 0, 0, 0)',
              'rgba(0, 0, 0, 0.3)',
              'rgba(0, 0, 0, 0.5)',
              'rgba(0, 0, 0, 0.8)',
            ]}
            sharedTransitionTag={`event-content-${event.id}`}
            style={styles.animatedLinearGradient}
          />
          <Animated.Image
            sharedTransitionTag={`event-image-${event.id}`}
            source={{ uri: event.images[0].url }}
            style={styles.cardImage}
          />
          <Animated.View style={styles.cardContent}>
            <Animated.Text
              style={styles.eventTitle}
              sharedTransitionTag={`event-title-${event.id}`}>
              {event.title}
            </Animated.Text>
            <Animated.View
              style={{ zIndex: 2 }}
              sharedTransitionTag={`event-card-bottom-info-${event.id}`}>
              <EventCardBottomInfo
                points={event.points}
                location={event.location}
                date={event.start_date}
              />
            </Animated.View>
          </Animated.View>
        </AnimatedPressable>
      );
    },
    [navigation]
  );

  const OverlayLabel = useCallback((emojis: string[]) => {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    return (
      <View style={styles.overlayLabelContainer}>
        <Text style={{ fontSize: 128 }}>{randomEmoji}</Text>
      </View>
    );
  }, []);

  if (isLoading && !data) {
    return (
      <ScreenContent>
        <Text>Loading...</Text>
      </ScreenContent>
    );
  }

  if (!events.length) {
    return (
      <ScreenContent>
        <Text>No events to display</Text>
      </ScreenContent>
    );
  }

  return (
    <ScreenContent>
      <NotificationPrompt />
      <GestureHandlerRootView style={{ flex: 1, marginTop: SCREEN_HEIGHT * 0.05 }}>
        <Swiper
          ref={ref}
          cardStyle={styles.cardStyle}
          data={events}
          renderCard={renderCard}
          onIndexChange={handleIndexChange}
          onSwipeRight={async (cardIndex) => {
            try {
              const {
                data: { session },
              } = await supabase.auth.getSession();
              await supabase.from('favorite_events').insert({
                user_id: session?.user.id as string,
                event_id: events[cardIndex].id,
              });

              await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
            } catch (error) {
              console.error('Error adding favorite:', error);
            }
          }}
          onSwipedAll={() => {
            setSwipeAll(true);
          }}
          onSwipeLeft={(cardIndex) => {
            // console.log('onSwipeLeft', cardIndex);
          }}
          onSwipeTop={async (cardIndex) => {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            await supabase.from('booking').insert({
              user_id: session?.user.id as string,
              event_id: events[cardIndex].id,
            });
            // navigation.navigate('Main', {
            //   screen: 'Bookings',
            // });
          }}
          OverlayLabelRight={() => OverlayLabel(['🥳', '😍', '🤩', '🤑'])}
          OverlayLabelLeft={() => OverlayLabel(['🫠', '🥲', '😭', '😱'])}
          OverlayLabelTop={() => OverlayLabel(['', '🤑', '💸'])}
          disableBottomSwipe
        />
        {swipeAll && (
          <Animated.View entering={FadeIn.duration(1000)} style={styles.swipeAllContainer}>
            <Text style={styles.swipeAllText}>😩</Text>
            <Text style={styles.swipeAllSubText}>No more experiences to display</Text>
          </Animated.View>
        )}
      </GestureHandlerRootView>
    </ScreenContent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    bottom: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 80,
    borderRadius: 40,
    marginHorizontal: 20,
    aspectRatio: 1,
    backgroundColor: '#3A3D45',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardStyle: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },
  renderCardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#101010',
    borderRadius: 15,
    overflow: 'hidden',
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
    padding: SCREEN_WIDTH * 0.048,
  },
  eventTitle: {
    fontSize: SCREEN_WIDTH * 0.067,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  pointsText: {
    fontSize: SCREEN_WIDTH * 0.043,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  eventInfo: {
    marginTop: SCREEN_HEIGHT * 0.01,
    fontSize: 18,
    color: 'white',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  locationText: {
    fontSize: SCREEN_WIDTH * 0.038,
    color: 'white',
  },
  dateText: {
    fontSize: SCREEN_WIDTH * 0.034,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLabelContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedLinearGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: -1,
  },
  swipeAllContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -99,
  },
  swipeAllText: {
    fontSize: 128,
  },
  swipeAllSubText: {
    fontSize: 24,
    fontFamily: FONTS.MEDIUM,
    color: 'white',
    marginTop: 20,
  },
});
