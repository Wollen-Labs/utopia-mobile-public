import { Pagination } from 'components/Pagination';
import { FONTS } from 'constants/fonts';
import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Animated, {
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useOnboardingStore } from '../store/onboardingStore';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../assets/onboarding/slide1.png'),
    title: 'Your World',
    titleHighlight: 'Unlocked',
    description:
      'You have earned you VIP status. This is your gateway to a world of curated rewards, high-end goods, and unforgettable experiences.',
  },
  {
    id: '2',
    image: require('../assets/onboarding/slide2.png'),
    title: 'Climb',
    titleHighlight: 'Higher',
    description:
      'Earn points for your activities on Betswap. The come redeem them here. The more you contribute, the higher you climb.',
  },
  {
    id: '3',
    image: require('../assets/onboarding/slide3.png'),
    title: 'Made just for',
    titleHighlight: 'you',
    description:
      'Access private events, early product releases, and luxury experiences tailored to your unique tastes. Enjoy perks designed for those who stand out.',
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const setHasCompletedOnboarding = useOnboardingStore((state) => state.setHasCompletedOnboarding);
  const setNeedsToEditName = useOnboardingStore((state) => state.setNeedsToEditName);
  const position = useSharedValue(0);

  const handleComplete = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setHasCompletedOnboarding(true);
      setNeedsToEditName(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: (typeof slides)[0]; index: number }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <Image
          source={require('assets/utopia-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </SafeAreaView>
      <View style={styles.content}>
        <Text style={styles.title}>
          {item.title} <Text style={styles.titleHighlight}>{item.titleHighlight}</Text>
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    setCurrentIndex(index);
    position.value = withTiming(index, { duration: 500 });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <Pagination numberOfSlides={slides.length} position={position} />
        </View>
        <View style={styles.buttonContainer}>
          {currentIndex === slides.length - 1 && (
            <AnimatedTouchableOpacity
              entering={SlideInDown.duration(500)}
              exiting={SlideOutDown.duration(500)}
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={isLoading}>
              <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Get Started'}</Text>
            </AnimatedTouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  slide: {
    width,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    position: 'absolute',
    bottom: 140,
    padding: 20,
  },
  title: {
    fontFamily: FONTS.LIGHT,
    color: '#FFFFFF',
    fontSize: 35,
    marginBottom: 16,
  },
  titleHighlight: {
    fontFamily: FONTS.ITALIC,
    fontStyle: 'italic',
    fontSize: 45,
  },
  description: {
    fontFamily: FONTS.REGULAR,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFD700',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContainer: {
    height: 50,
  },
  buttonText: {
    fontFamily: FONTS.MEDIUM,
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
