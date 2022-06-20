import React, { useState } from 'react';
import { ScrollView, View, ScrollViewProps, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface IProps extends ScrollViewProps {
  onChangeSelect: (color: string) => void;
  fill?: string;
}

const colorArr = [Colors.green, 'red', 'purple', 'orange'];

export function ColorList({
  fill = colorArr[0],
  onChangeSelect,
  ...rest
}: IProps) {
  const [color, setColor] = useState(fill);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      {...rest}>
      {colorArr.map((res, i) => {
        return (
          <TouchableWithoutFeedback
            key={i}
            onPress={() => {
              setColor(res);
              onChangeSelect(res);
            }}>
            <View
              style={[
                styles.item,
                {
                  opacity: res === color ? 1 : 0.2,
                  backgroundColor: res,
                },
              ]}
            />
          </TouchableWithoutFeedback>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
});
