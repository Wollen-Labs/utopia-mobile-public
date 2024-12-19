import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { FONTS } from 'constants/fonts';
import { useUserProfile } from 'hooks/useUserProfile';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const UserHeader = (props: BottomTabHeaderProps) => {
  const { data: userProfile, isLoading } = useUserProfile();

  const headerContent = (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        {isLoading ? (
          <>
            <View style={[styles.name, styles.placeholder]} />
            <View style={[styles.pointsContainer, styles.placeholder]} />
          </>
        ) : (
          <>
            <Text style={styles.name}>
              {userProfile?.first_name || ''} {userProfile?.last_name || ''}
            </Text>
            <View style={styles.pointsContainer}>
              <FontAwesome6 name="award" size={24} color="#FFD700" />
              <Text style={styles.points}>{userProfile?.points?.toLocaleString() || 0} pts</Text>
            </View>
          </>
        )}
      </View>
      <Pressable
        style={styles.avatarContainer}
        onPress={() => {
          props.navigation.navigate('Profile');
        }}>
        {!isLoading && userProfile?.avatar_url ? (
          <Image source={{ uri: userProfile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar} />
        )}

        <View style={styles.vipBadge}>
          <Text style={styles.vipText}>VIP</Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {headerContent}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#000000',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  leftContent: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  points: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: '#FFD700',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
  },
  vipBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#4A494E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vipText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 10,
    color: '#E6E6E6',
  },
  placeholder: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    height: 24,
    width: 120,
  },
});
