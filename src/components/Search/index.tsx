import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { CustomButton } from "../CustomButton";

interface Props extends TextInputProps {
  onChangeValue: (val: any) => void;
  filter?: string;
}

export function SearchBar({ filter = "", onChangeValue, ...rest }: Props) {
  const { control } = useForm();

  return (
    <Controller
      name="search"
      control={control}
      defaultValue={filter}
      render={({ field: { onChange, value } }) => {
        return (
          <View style={styles.container}>
            <TextInput
              placeholder="Procurar.."
              onChangeText={onChange}
              value={value}
              onEndEditing={() =>
                value === filter ? undefined : onChangeValue(value)
              }
              style={styles.input}
              {...rest}
            />
            {value !== "" && (
              <CustomButton
                size={16}
                onPressOut={Keyboard.dismiss}
                onPress={function () {
                  onChangeValue("");
                  onChange("");
                }}
                color={Colors.green}
                icon="close"
              />
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    borderRadius: 11,
    flexShrink: 1,
    marginHorizontal: 25,
  },
  input: {
    flexShrink: 1,
    height: 40,
    width: "100%",
    color: "grey",
    fontSize: 14,
  },
});
