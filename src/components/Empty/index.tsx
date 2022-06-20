import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from "../../constants/fonts";

interface IProps {
  horizontal?: number;
}

export const Empty: React.FC<IProps> = ({ horizontal = 15 }) => {
  return (
    <View style={[styles.container, { marginHorizontal: horizontal }]}>
      <Text style={styles.text}>Nenhum item encontrado</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: "#eee",
    justifyContent: "center",
    paddingHorizontal: 15,
    borderRadius: 7,
  },
  text: {
    color: "grey",
    fontFamily: Fonts.text,
    fontSize: 14,
  },
});
