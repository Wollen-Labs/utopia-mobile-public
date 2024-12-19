import { FONTS } from 'constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, FlatList, Dimensions } from 'react-native';

import { ScreenContent } from './ScreenContent';

export default function ListScreenWrapper({
  title,
  length,
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onEndReachedThreshold,
  contentContainerStyle,
  emptyListText,
}: {
  children?: React.ReactElement;
  title: string;
  length: number;
  data: any[];
  renderItem: ({ item }: { item: any }) => JSX.Element;
  keyExtractor: (item: any) => string;
  onEndReached: () => void;
  onEndReachedThreshold: number;
  contentContainerStyle: object;
  emptyListText?: string;
}) {
  return (
    <ScreenContent>
      <View style={styles.wrapper}>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 0.8)',
            'rgba(0, 0, 0, 0.2)',
            'rgba(0, 0, 0, 0)',
          ]}
          style={styles.topGradient}
          pointerEvents="none"
        />
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
          contentContainerStyle={[contentContainerStyle, styles.flatList]}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 120 }}>🫠</Text>
              <Text style={{ color: 'white', fontSize: 20, fontFamily: FONTS.BOLD }}>
                {emptyListText}
              </Text>
            </View>
          }
          ListHeaderComponent={
            <View style={styles.titleContainer}>
              <Text style={styles.pageTitle}>
                {title} <Text style={styles.count}>({length})</Text>
              </Text>
            </View>
          }
        />
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
      </View>
    </ScreenContent>
  );
}
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  flatList: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  count: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: 20,
    color: '#8A8A8A',
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 34,
    color: '#FFFFFF',
    width: '100%',
    textAlign: 'left',
    marginBottom: 24,
    marginTop: 24,
  },
  titleContainer: {
    width: SCREEN_WIDTH - 32,
  },
  topGradient: {
    height: 50,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  bottomGradient: {
    height: 150,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 1000,
  },
});
