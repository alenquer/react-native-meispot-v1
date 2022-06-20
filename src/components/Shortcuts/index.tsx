import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Constants } from '../../constants';
import { Fonts } from '../../constants/fonts';
import items from './items';

export function Shortcuts({ ...rest }: ViewStyle) {
  const { navigate }: any = useNavigation();

  function go(item: any) {
    navigate(item.route, {
      category: item.route,
    });
  }

  return (
    <View style={[styles.container, { ...rest }]}>
      <ScrollView
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, alignItems: 'center' }}>
        {items.map((item, idx) => {
          return (
            <TouchableOpacity
              key={item.route}
              style={[
                styles.itemContainer,
                { marginRight: idx === items.length - 1 ? 0 : 15 },
              ]}
              onPress={() => go(item)}>
              <MaterialCommunityIcons
                size={Constants.SHORTCUT_ICON_SIZE / 2}
                name={item.icon as any}
                color={Colors.green_dark}
                style={styles.icon}
              />
              <Text style={styles.itemLabel}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  itemContainer: {
    alignItems: 'center',
  },
  icon: {
    backgroundColor: Colors.green_light,
    padding: Constants.SHORTCUT_ICON_SIZE / 4,
    borderRadius: Constants.SHORTCUT_ICON_SIZE / 2,
  },
  itemLabel: {
    fontFamily: Fonts.text,
    fontSize: 12,
    color: Colors.green_dark,
    marginTop: 2.4,
  },
});
