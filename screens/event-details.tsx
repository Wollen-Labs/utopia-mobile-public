import { FontAwesome5 } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from 'components/Button';
import EventCardBottomInfo from 'components/EventCardBottomInfo';
import { Pagination } from 'components/Pagination';
import { LinearGradient } from 'expo-linear-gradient';
import { useEventDetails } from 'hooks/useEventDetails';
import { RootStackParamList } from 'navigation/types';
import React, { useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import Animated, {
  FadeOutDown,
  useSharedValue,
  withTiming,
  FadeOut,
  FadeIn,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSwiperStore } from 'store/swiperStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.6;
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.6;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function EventDetails({
  route,
  navigation,
}: {
  route: RouteProp<RootStackParamList, 'EventDetails'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'EventDetails'>;
}) {
  const { event: initialEvent } = route.params;
  const { data: event } = useEventDetails(initialEvent?.id ?? '', initialEvent);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollOffset = useRef(0);
  const position = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const swiperRef = useSwiperStore((state) => state.swiperRef);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scrollY.value * 0.5 }],
    };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scrollY.value * 0.9 }],
    };
  });

  const handleBookExperience = async () => {
    navigation.goBack();
    setTimeout(() => {
      swiperRef?.current?.swipeTop();
    }, 900);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeAreaView}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        scrollToOverflowEnabled={false}
        overScrollMode="never"
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <View style={styles.header}>
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              position.value = offsetX / SCREEN_WIDTH;
              scrollOffset.current = offsetX;
            }}
            scrollEventThrottle={16}
            style={[styles.imageContainer, animatedImageStyle]}>
            <Animated.View>
              <AnimatedLinearGradient
                colors={[
                  'rgba(0, 0, 0, 0)',
                  'rgba(0, 0, 0, 0.3)',
                  'rgba(0, 0, 0, 0.5)',
                  'rgba(0, 0, 0, 0.8)',
                ]}
                sharedTransitionTag={`event-content-${event.id}`}
                style={styles.linearGradient}
              />
              <Animated.Image
                source={{ uri: event.images?.[0]?.url }}
                style={[styles.image]}
                resizeMode="cover"
                sharedTransitionTag={`event-image-${event.id}`}
              />
            </Animated.View>
            {event.images?.slice(1).map((image, index) => (
              <View key={index}>
                <AnimatedLinearGradient
                  colors={[
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0.3)',
                    'rgba(0, 0, 0, 0.5)',
                    'rgba(0, 0, 0, 0.8)',
                  ]}
                  style={styles.linearGradient}
                />
                <Animated.Image
                  source={{ uri: image.url }}
                  style={[styles.image]}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Animated.ScrollView>
          <Animated.View
            entering={FadeIn.duration(900)}
            exiting={FadeOut.duration(500)}
            style={[styles.paginationContainer, animatedImageStyle]}>
            <Pagination numberOfSlides={event.images?.length ?? 0} position={position} />
          </Animated.View>
        </View>
        <Animated.View style={[styles.content, animatedTextStyle]}>
          <Animated.Text style={[styles.title]} sharedTransitionTag={`event-title-${event.id}`}>
            {event.title}
          </Animated.Text>
          <Animated.View
            style={styles.eventCardBottomInfo}
            sharedTransitionTag={`event-card-bottom-info-${event.id}`}>
            <EventCardBottomInfo
              points={event.points}
              location={event.location}
              date={event.start_date}
            />
          </Animated.View>

          <Text style={styles.description}>{event.description}</Text>
        </Animated.View>
      </Animated.ScrollView>
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0)',
          'rgba(0, 0, 0, 0.2)',
          'rgba(0, 0, 0, 0.8)',
          'rgba(0, 0, 0, 1)',
        ]}
        style={styles.bottomGradient}
        pointerEvents="none"
      />
      <Button title="Book Experience" onPress={handleBookExperience} style={styles.bookButton} />

      <AnimatedPressable
        exiting={FadeOutDown.duration(500)}
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={() => {
          scrollViewRef.current?.scrollTo({
            x: 0,
            animated: true,
          });
          position.value = withTiming(0);
          setTimeout(() => {
            navigation.goBack();
          }, 300);
        }}>
        <FontAwesome5 name="arrow-left" size={24} color="white" />
      </AnimatedPressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'black',
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
  },
  linearGradient: {
    height: 150,
    position: 'absolute',
    top: IMAGE_HEIGHT - 150,
    left: 0,
    right: 0,
  },
  paginationContainer: {
    height: 150,
    position: 'absolute',
    top: IMAGE_HEIGHT - 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  eventCardBottomInfo: {
    zIndex: 2,
  },
  bottomGradient: {
    height: 250,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 3,
  },
  container: {
    backgroundColor: '#000',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    zIndex: -1,
  },
  content: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.048,
    position: 'relative',
    backgroundColor: 'black',
    zIndex: 3,
  },
  backButton: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.048,
    zIndex: 2,
    padding: SCREEN_WIDTH * 0.02,
    borderRadius: SCREEN_WIDTH * 0.048,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    zIndex: 2,
    fontSize: SCREEN_WIDTH * 0.067,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  points: {
    fontSize: SCREEN_WIDTH * 0.043,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  eventInfo: {
    marginTop: SCREEN_HEIGHT * 0.01,
    transform: [{ scale: 0.9 }, { translateX: 0 }],
    fontSize: 18,

    color: 'white',
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  location: {
    fontSize: SCREEN_WIDTH * 0.038,
    color: 'white',
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  date: {
    fontSize: SCREEN_WIDTH * 0.034,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  aboutSection: {
    marginTop: SCREEN_HEIGHT * 0.03,
    paddingTop: SCREEN_HEIGHT * 0.03,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: SCREEN_WIDTH * 0.058,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  description: {
    marginTop: 20,
    fontSize: SCREEN_WIDTH * 0.038,
    lineHeight: SCREEN_HEIGHT * 0.03,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 200,
  },
  bookButton: {
    marginHorizontal: SCREEN_WIDTH * 0.048,
    zIndex: 4,
  },
  bookButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
