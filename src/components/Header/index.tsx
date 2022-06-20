import React from 'react';
import { StyleSheet, Text, TouchableOpacityProps, View } from 'react-native';
import { Constants } from '../../constants';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { BackButton } from '../BackButton';
import { CustomButton } from '../CustomButton';

interface IHeader extends TouchableOpacityProps {
  color?: string;
  title: string;
  icon: any;
}

export const Header: React.FC<IHeader> = ({ title, icon, ...rest }) => {
  return (
    <View style={styles.header}>
      <BackButton color={Colors.green} />
      <Text style={styles.title}>{title}</Text>
      <CustomButton icon={icon} {...rest} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: Constants.STATUS_BAR_HEIGHT + 15,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.heading,
    color: Colors.heading,
  },
});
