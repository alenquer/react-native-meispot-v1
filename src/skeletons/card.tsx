import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Constants } from '../constants';
import { ShimmerPlaceholder } from '../utils/container';
import { ScreenWidth } from '../utils/layout';

export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <ShimmerPlaceholder style={styles.icon} />
        <View style={{ marginHorizontal: 10 }}>
          <ShimmerPlaceholder
            style={[styles.text, { width: ScreenWidth(30) }]}
          />
          <ShimmerPlaceholder
            style={[styles.text, { width: ScreenWidth(40) }]}
          />
        </View>
      </View>
      <ShimmerPlaceholder style={[styles.text, { width: 24, height: 24 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Constants.CARD_ITEM_HEIGHT,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: Constants.CARD_ICON_SIZE,
    height: Constants.CARD_ICON_SIZE,
    borderRadius: 999,
  },
  text: {
    marginVertical: 2.4,
    borderRadius: 999,
  },
});
