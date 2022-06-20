import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Constants } from '../../constants';

export function FloatActionButton({ icon, color, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: color }]}
      onPress={onPress}>
      <MaterialCommunityIcons name={icon as any} size={24} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 999,
    shadowOpacity: 0.35,
    bottom: Constants.FAB_BOTTOM_POSITION,
    right: Constants.FAB_RIGHT_POSITION,
    shadowOffset: { width: 0, height: 5 },
    shadowColor: '#000',
    shadowRadius: 3,
    elevation: 3,
  },
});
