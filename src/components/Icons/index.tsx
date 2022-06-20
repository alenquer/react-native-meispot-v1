import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView, TouchableOpacity, ScrollViewProps} from 'react-native';

interface IProps extends ScrollViewProps {
  onChangeSelect: (color: string) => void;
  color: string;
  size?: number;
  icon: any;
}

export const iconArr = [
  'folder',
  'cog',
  'star',
  'fire',
  'glass-mug-variant',
  'account',
  'lock',
  'mouse',
];

export function Icons({
  icon,
  size = 60,
  color,
  onChangeSelect,
  ...rest
}: IProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingLeft: 15}}
      {...rest}>
      {iconArr.map((res, i) => {
        const selected = res === icon;

        return (
          <TouchableOpacity
            key={i}
            onPress={() => onChangeSelect(res)}
            style={{marginRight: i === iconArr.length - 1 ? 15 : 10}}>
            <MaterialCommunityIcons
              name={res as any}
              size={size / 2}
              color={selected ? 'white' : 'grey'}
              style={{
                opacity: selected ? 1 : 0.4,
                backgroundColor: selected ? color : 'transparent',
                padding: size / 8,
                borderRadius: size / 2,
              }}
            />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
