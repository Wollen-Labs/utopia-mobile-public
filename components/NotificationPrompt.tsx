import { useIsFocused } from '@react-navigation/native';
import { FONTS } from 'constants/fonts';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { useNotificationStore } from 'store/notificationStore';

import { Button } from './Button';
const { width, height } = Dimensions.get('window');

export const NotificationPrompt = () => {
  const [visible, setVisible] = useState(false);
  const isFocused = useIsFocused();
  const { setHasPromptedNotifications, setLastNotificationPrompt, shouldShowNotificationPrompt } =
    useNotificationStore();

  useEffect(() => {
    checkAndShowPrompt();
  }, [isFocused]);

  const checkAndShowPrompt = async () => {
    const shouldShow = await shouldShowNotificationPrompt();
    if (shouldShow) {
      setVisible(true);
    }
  };

  const handleRequestPermission = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        setHasPromptedNotifications(true);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setLastNotificationPrompt(Date.now());
      setVisible(false);
    }
  };

  const handleMaybeLater = () => {
    setLastNotificationPrompt(Date.now());
    setVisible(false);
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={handleMaybeLater}>
      <View style={styles.container}>
        <Image
          source={require('../assets/notifications/background.png')}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.title}>Stay in the inner circle</Text>
          <Text style={styles.description}>
            Get notified when the most coveted rewards and opportunities drop. You deserve to be in
            the know.
          </Text>
          <Button title="Turn on Notifications" onPress={handleRequestPermission} />
          <TouchableOpacity style={styles.maybeLaterButton} onPress={handleMaybeLater}>
            <Text style={styles.maybeLaterText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    backgroundColor: '#000000',
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
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontFamily: FONTS.SEMI_BOLD,
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 40,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONTS.REGULAR,
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 7,
  },
  buttonText: {
    fontFamily: FONTS.MEDIUM,
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
  maybeLaterButton: {
    marginTop: 20,
  },
  maybeLaterText: {
    fontFamily: FONTS.REGULAR,
    color: '#FFFFFF',
    opacity: 0.5,
    fontSize: 16,
    textAlign: 'center',
  },
});
