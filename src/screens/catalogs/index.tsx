import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Constants } from '../../constants';
import { BackButton } from '../../components/BackButton';
import { SearchBar } from '../../components/Search';
import { CustomButton } from '../../components/CustomButton';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { AnimatedHeaderComponent, AnimatedIcon } from '../../utils/container';
import { ObservedCatalogs } from '../../components/Cards/Catalog/observables';
import {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export function Catalogs() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('');

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event: any) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, Constants.HEADER_MAX_HEIGHT],
        [Constants.HEADER_MAX_HEIGHT, Constants.HEADER_MIN_HEIGHT],
        Extrapolate.CLAMP,
      ),
    };
  });

  const avatarStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [40, Constants.HEADER_MAX_HEIGHT],
        [1, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedHeaderComponent
        colors={[Colors.green_bright, Colors.green]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, headerStyle]}>
        <View style={styles.navigation}>
          <BackButton color="white" />
          <SearchBar onChangeValue={setFilter} filter={filter} />
          <CustomButton
            icon="plus"
            color="white"
            onPress={() => navigation.navigate('catalog' as never, {} as never)}
          />
        </View>
        <View style={styles.icontainer}>
          <AnimatedIcon
            name={Constants.CATALOGS_ICON as any}
            size={Constants.GROUP_ICON_SIZE}
            color="white"
            style={[avatarStyle]}
          />
        </View>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Catálogos</Text>
        </View>
      </AnimatedHeaderComponent>
      <ObservedCatalogs
        table="catalogs"
        filter={filter}
        contentContainerStyle={{ paddingTop: Constants.HEADER_MAX_HEIGHT }}
        onScroll={scrollHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    paddingTop: Constants.STATUS_BAR_HEIGHT,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  navigation: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  icontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    position: 'relative',
    height: 55,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  listTitle: {
    color: Colors.heading,
    fontFamily: Fonts.heading,
    fontSize: 16,
  },
});
