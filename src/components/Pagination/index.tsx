import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { CustomButton } from '../CustomButton';

export function Pagination({ leftAction, page, totalPages, rightAction }: any) {
  return (
    <View style={styles.container}>
      <CustomButton
        icon="chevron-left"
        onPress={leftAction}
        size={32}
        color={page <= 1 ? Colors.green_light : Colors.green}
      />
      <TouchableWithoutFeedback style={[styles.actionButton]}>
        <Text style={styles.page}>{page}</Text>
      </TouchableWithoutFeedback>
      <CustomButton
        icon="chevron-right"
        onPress={rightAction}
        size={32}
        color={page >= totalPages ? Colors.green_light : Colors.green}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //height: 70,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    fontSize: 16,
    color: 'white',
    fontFamily: Fonts.heading,
  },
  actionButton: {
    minWidth: 24,
    height: 24,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 3.2,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
