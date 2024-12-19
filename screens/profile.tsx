import { FontAwesome5 } from '@expo/vector-icons';
import { EditProfileModal } from 'components/EditProfileModal';
import { FONTS } from 'constants/fonts';
import * as Application from 'expo-application';
import * as ImagePicker from 'expo-image-picker';
import { useUserProfile } from 'hooks/useUserProfile';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { useOnboardingStore } from 'store/onboardingStore';
import { supabase } from 'utils/supabase';

export default function Profile() {
  const { data: userProfile, refetch } = useUserProfile();
  const [uploading, setUploading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { setHasCompletedOnboarding, needsToEditName, setNeedsToEditName } = useOnboardingStore();

  useEffect(() => {
    if (needsToEditName && userProfile) {
      setIsEditModalVisible(true);
      setNeedsToEditName(false);
    }
  }, [needsToEditName, userProfile]);

  const uploadImage = async (uri: string, mimeType: string) => {
    try {
      setUploading(true);

      const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;

      // Convert image to ArrayBuffer
      const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());

      // Upload to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: mimeType || 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicURL } = supabase.storage.from('avatars').getPublicUrl(data.path);

      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profile')
        .update({ avatar_url: publicURL.publicUrl })
        .eq('id', userProfile?.id as string);

      if (updateError) throw updateError;

      await refetch();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An error occurred while uploading the image');
      }
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.');
        return;
      }

      const image = result.assets[0];

      if (!image.uri) {
        throw new Error('No image uri!');
      }

      await uploadImage(image.uri, image.mimeType || 'image/jpeg');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An error occurred while picking the image');
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut().finally(() => {
      setHasCompletedOnboarding(false);
      setNeedsToEditName(true);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.firstContentContainer}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage} disabled={uploading}>
            {userProfile?.avatar_url ? (
              <Image source={{ uri: userProfile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar} />
            )}
            <View style={styles.avatarBorder} />
            <View style={styles.editBadge}>
              <FontAwesome5 name="pencil-alt" size={12} color="#000000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nameContainer}
            onPress={() => setIsEditModalVisible(true)}>
            <Text style={styles.name}>
              {userProfile?.first_name || ''} {userProfile?.last_name || ''}
            </Text>
            <FontAwesome5 name="pencil-alt" size={14} color="#666666" style={styles.editNameIcon} />
          </TouchableOpacity>
          <Text style={styles.memberType}>VIP Member</Text>

          <View style={styles.pointsContainer}>
            <Text style={styles.pointsValue}>
              <FontAwesome5 name="award" size={20} color="#FFD700" />
              {'  '}
              {userProfile?.points?.toLocaleString() || 0}{' '}
              <Text style={styles.pointsLabel}>Pts</Text>
            </Text>
          </View>
        </View>

        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#1A1A1A', true: '#FFD700' }}
              thumbColor={
                Platform.OS === 'ios' ? '#FFFFFF' : notificationsEnabled ? '#FFFFFF' : '#666666'
              }
            />
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign out</Text>
            <FontAwesome5 name="sign-out-alt" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>You are on v{Application.nativeApplicationVersion}</Text>

        {userProfile && (
          <EditProfileModal
            visible={isEditModalVisible}
            onClose={() => setIsEditModalVisible(false)}
            currentFirstName={userProfile.first_name}
            currentLastName={userProfile.last_name}
            userId={userProfile.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    paddingTop: 48,
    justifyContent: 'space-between',
  },
  firstContentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
  },
  avatarBorder: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: '#4A494E',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: 32,
    color: '#FFFFFF',
  },
  editNameIcon: {
    marginLeft: 8,
  },
  memberType: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 18,
    color: '#666666',
    marginBottom: 10,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsValue: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: 20,
    color: '#FFD700',
  },
  pointsLabel: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: 15,
    color: '#FFD700',
  },
  settingsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingLabel: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: '#FFFFFF',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
  },
  signOutText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: '#FFFFFF',
  },
  version: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: '#666666',
    marginBottom: 32,
    marginTop: 30,
  },
});
