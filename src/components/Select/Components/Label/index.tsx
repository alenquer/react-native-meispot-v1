import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../../../constants/colors';
import { IOptionComponent } from '../../Input';
import { Text, TouchableOpacity } from 'react-native';
import { Fonts } from '../../../../constants/fonts';

export function LabelOptions({ item, selected, change }: IOptionComponent) {
  const color = (placeholder: string) =>
    item.id === selected ? Colors.green : placeholder;

  return (
    <TouchableOpacity
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
      }}
      onPress={() => {
        change(item.id, item.name);
      }}>
      <Text
        style={{
          color: color(Colors.body_dark),
          fontSize: 14,
          fontFamily: Fonts.heading,
        }}>
        {item.name}
      </Text>
      <MaterialCommunityIcons
        name="circle"
        size={14}
        color={color(Colors.green_light)}
      />
    </TouchableOpacity>
  );
}
