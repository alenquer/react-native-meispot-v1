import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Constants } from '../../constants';
import { BackButton } from '../../components/BackButton';
import { SearchBar } from '../../components/Search';
import { CustomButton } from '../../components/CustomButton';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { AnimatedHeaderComponent, AnimatedIcon } from '../../utils/container';
import { FABSelect } from '../../components/Select/Button';
import { LabelOptions } from '../../components/Select/Components/Label';
import { ObservedPayments } from '../../components/Cards/Payment/observables';
import {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import Status from '../../@maps/Status';

export function Payments() {
  const navigation = useNavigation();
  const [status, setStatus] = useState('');
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
            onPress={() => navigation.navigate('payment' as never, {} as never)}
          />
        </View>
        <View style={styles.icontainer}>
          <AnimatedIcon
            name={Constants.PAYMENTS_ICON as any}
            size={Constants.GROUP_ICON_SIZE}
            color="white"
            style={[avatarStyle]}
          />
        </View>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{Status(status).payments}</Text>
        </View>
      </AnimatedHeaderComponent>
      <ObservedPayments
        table="payments"
        filter={filter}
        status={status}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: Constants.HEADER_MAX_HEIGHT,
        }}
      />
      <FABSelect
        icon="tag-multiple"
        color={Status(status).color}
        defaultValue={status}
        onChangeSelect={setStatus}
        OptionComponent={LabelOptions}
        data={[
          { id: '', name: Status('').payments },
          { id: 'done', name: Status('done').payments },
          { id: 'pending', name: Status('pending').payments },
          { id: 'canceled', name: Status('canceled').payments },
        ]}
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
