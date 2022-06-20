import React from 'react';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props extends Omit<TouchableOpacityProps, 'hitSlop'> {
  icon: any;
  color?: string;
  size?: number;
}

export function CustomButton({ icon, color, size = 24, ...rest }: Props) {
  return (
    <TouchableOpacity
      hitSlop={{ bottom: 5, top: 5, left: 5, right: 5 }}
      {...rest}>
      <MaterialCommunityIcons
        name={icon}
        size={size}
        color={color ?? Colors.green}
      />
    </TouchableOpacity>
  );
}
