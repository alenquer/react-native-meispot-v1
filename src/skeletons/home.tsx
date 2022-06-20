import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Constants } from '../constants';
import { ShimmerPlaceholder } from '../utils/container';
import { ScreenWidth } from '../utils/layout';
import { SkeletonCard } from './card';

export function SkeletonHome() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShimmerPlaceholder style={styles.smallIcon} />
          <ShimmerPlaceholder style={styles.headerTitle} />
        </View>
        <ShimmerPlaceholder style={styles.smallIcon} />
      </View>
      <View style={styles.shortcuts}>
        <View style={styles.shortcutList}>
          {Array.from({ length: Constants.INITIAL_ITEM_RENDER }).map((_, i) => {
            return (
              <View style={styles.shortcutContent} key={i}>
                <ShimmerPlaceholder style={styles.icon} />
                <ShimmerPlaceholder style={styles.label} />
              </View>
            );
          })}
        </View>
      </View>
      <ShimmerPlaceholder style={styles.activities} />
      <ShimmerPlaceholder style={{ margin: 15, borderRadius: 999 }} />
      {Array.from({ length: Constants.INITIAL_ITEM_RENDER }).map((_, i) => {
        return <SkeletonCard key={i} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginHorizontal: 10,
    borderRadius: 999,
    width: 100,
  },
  smallIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  icon: {
    width: Constants.SHORTCUT_ICON_SIZE,
    height: Constants.SHORTCUT_ICON_SIZE,
    borderRadius: Constants.SHORTCUT_ICON_SIZE / 2,
  },
  label: {
    width: Constants.SHORTCUT_ICON_SIZE / 2,
    marginTop: 2.4,
    borderRadius: 999,
  },
  shortcuts: {
    width: '100%',
    marginVertical: 15,
  },
  shortcutList: {
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  shortcutContent: {
    alignItems: 'center',
    marginRight: 15,
  },
  activities: {
    width: ScreenWidth(100) - 30,
    marginVertical: 15,
    height: 250,
    borderRadius: 25,
    alignSelf: 'center',
  },
});
