import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  ScrollViewProps,
} from 'react-native';

type IOmit =
  | 'nestedScrollEnabled'
  | 'showsVerticalScrollIndicator'
  | 'showsHorizontalScrollIndicator';

export const KeyboardAvoidingWrapper: React.FC<
  Omit<ScrollViewProps, IOmit>
> = ({ children, ...rest }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView
        {...rest}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
