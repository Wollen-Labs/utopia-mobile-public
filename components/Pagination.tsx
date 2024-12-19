import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  SharedValue,
  interpolateColor,
} from 'react-native-reanimated';

function PaginationElement({
  position,
  slideIndex,
}: {
  position: SharedValue<number>;
  slideIndex: number;
}) {
  const inputRange = [slideIndex - 1, slideIndex, slideIndex + 1];
  const dotAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(position.value, inputRange, [20, 40, 20], Extrapolation.CLAMP);

    return { width };
  });
  const dotContainerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(position.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);
    const backgroundColor = interpolateColor(position.value, inputRange, [
      'white',
      '#FED700',
      'white',
    ]);

    return { opacity, backgroundColor };
  });

  return (
    <Animated.View style={[styles.paginationElementContainer, dotContainerAnimatedStyle]}>
      <Animated.View
        style={[styles.paginationElement, dotAnimatedStyle, dotContainerAnimatedStyle]}
      />
    </Animated.View>
  );
}

export function Pagination({
  numberOfSlides,
  position,
}: {
  numberOfSlides: number;
  position: SharedValue<number>;
}) {
  return (
    <View style={styles.pagination}>
      {Array(numberOfSlides)
        .fill(1)
        .map((_, slideIndex) => {
          return <PaginationElement key={slideIndex} position={position} slideIndex={slideIndex} />;
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    marginTop: 20,
    marginRight: 8,
    flexDirection: 'row',
    width: 88,
  },
  paginationElement: {
    backgroundColor: '#FED700',
    borderRadius: 2,
    height: 8,
    width: 8,
  },
  paginationElementContainer: {
    alignItems: 'flex-end',
    borderRadius: 2,
    backgroundColor: 'black',
    marginHorizontal: 4,
    overflow: 'hidden',
  },
});
