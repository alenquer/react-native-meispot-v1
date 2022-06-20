import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { CustomButton } from '../CustomButton';

interface Props {
  color?: string;
}

export function BackButton({ color }: Props) {
  const { goBack } = useNavigation();

  return (
    <CustomButton
      icon="arrow-left-circle"
      color={color ?? Colors.green}
      onPress={goBack}
    />
  );
}
