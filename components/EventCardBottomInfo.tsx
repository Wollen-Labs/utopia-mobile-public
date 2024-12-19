import { FontAwesome6 } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { FONTS } from 'constants/fonts';
import { format } from 'date-fns';
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const EventCardBottomInfo = React.forwardRef(
  (
    {
      points,
      location,
      date,
    }: {
      points: number;
      location: string;
      date: string;
    },
    ref
  ) => {
    return (
      <View ref={ref as React.LegacyRef<View>} style={styles.container}>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomItemContainer}>
            <FontAwesome6 name="award" size={20} color="#FFD700" />
            <Text style={styles.points}>{points} pts</Text>
          </View>
          <View style={styles.bottomItemContainer}>
            <Entypo name="location-pin" size={20} color="#fff" />
            <Text style={styles.itemText}>{location}</Text>
          </View>
          <View style={styles.bottomItemContainer}>
            <AntDesign name="calendar" size={20} color="#fff" />
            <Text style={styles.itemText}>{date ? format(new Date(date), 'MMM yy') : ''}</Text>
          </View>
        </View>
      </View>
    );
  }
);

export default EventCardBottomInfo;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  bottomContainer: {
    fontSize: SCREEN_WIDTH * 0.038,
    color: 'white',
    flexDirection: 'row',
  },
  dateText: {
    fontSize: SCREEN_WIDTH * 0.034,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  points: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: '#FFD700',
    marginLeft: 10,
  },
  itemText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  bottomItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
});
