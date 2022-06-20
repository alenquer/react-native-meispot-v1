import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

type HideInputProps =
  | 'style'
  | 'onEndEditing'
  | 'onFocus'
  | 'onBlur'
  | 'style'
  | 'multiline';

interface IInput extends Omit<TextInputProps, HideInputProps> {
  rightComponent?: JSX.Element;
  border?: { top?: number; bottom?: number };
  style?: ViewStyle;
  multiline?: boolean;
  limit?: number;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function GroupInput({
  rightComponent,
  border,
  style,
  multiline,
  limit = 40,
  ...rest
}: IInput) {
  const [isFocused, setFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  return (
    <View
      style={[
        styles.container,
        {
          ...style,
          borderBottomColor: isFocused ? Colors.green : Colors.shape,
        },
      ]}>
      <AnimatedTextInput
        {...rest}
        maxLength={multiline ? 240 : limit}
        multiline={multiline}
        selectionColor={Colors.green}
        onEndEditing={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        placeholderTextColor="grey"
        style={[
          styles.input,
          {
            marginRight: rightComponent && !multiline ? 15 : 0,
          },
        ]}
      />
      {!multiline && rightComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    maxHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    borderColor: Colors.shape,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  input: {
    padding: 0,
    fontFamily: Fonts.text,
    color: Colors.heading,
    fontSize: 14,
    width: '100%',
    flexShrink: 1,
  },
});
