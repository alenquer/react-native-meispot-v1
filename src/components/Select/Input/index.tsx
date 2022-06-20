import React, { Fragment, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "../../CustomButton";
import { Colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { Constants } from "../../../constants";
import ReactNativeModal from "react-native-modal";

interface IItem {
  id: any;
  name: string;
}

export interface IOptionComponent {
  item: IItem;
  selected: string;
  change(id: any, name: string): () => void;
}

interface IProps {
  data: any[];
  onChangeSelect: (id: any) => void;
  text: string;
  title?: string;
  defaultValue?: string;
  OptionComponent: ({ item, selected, change }: any) => JSX.Element;
}

export const InputSelect: React.FC<IProps> = ({
  data,
  text,
  title = "Selecionar",
  onChangeSelect,
  defaultValue = "",
  OptionComponent,
}) => {
  const [selected, setSelected] = useState(defaultValue);
  const [label, setLabel] = useState(text);
  const [mark, setMarked] = useState(text);
  const [modalVisible, setModalVisible] = useState(false);

  function RenderOption({ item }: any) {
    return (
      <OptionComponent
        item={item}
        selected={selected}
        change={(id: any, name: any) => {
          setSelected(id);
          setMarked(name);
        }}
      />
    );
  }

  function close() {
    return setModalVisible(false);
  }

  function open() {
    setSelected(defaultValue);
    return setModalVisible(true);
  }

  function save() {
    close();
    setLabel(mark);
    onChangeSelect(selected);
  }

  return (
    <Fragment>
      <TouchableOpacity
        style={{
          ...styles.container,
          backgroundColor: selected ? "white" : "#fff",
        }}
        onPress={open}
      >
        <Text style={styles.inputTitle} numberOfLines={1}>
          {label != "" ? label : "Selecionar"}
        </Text>
        <CustomButton icon="menu-down" color="grey" disabled />
      </TouchableOpacity>
      <ReactNativeModal
        isVisible={modalVisible}
        statusBarTranslucent
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={Constants.ANIMATION_MODAL_DURATION}
        animationOutTiming={Constants.ANIMATION_MODAL_DURATION}
        onDismiss={close}
        onBackButtonPress={close}
        style={{ margin: 0 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingTop: Constants.STATUS_BAR_HEIGHT,
          }}
        >
          <View style={{ ...styles.header }}>
            <CustomButton icon="close" onPress={close} />
            <Text style={styles.headerTitle}>{title}</Text>
            <CustomButton icon="check" onPress={save} />
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <RenderOption item={item} />}
          />
        </View>
      </ReactNativeModal>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 200,
    borderColor: "#dadada",
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 34,
    paddingHorizontal: 9,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: Fonts.heading,
    color: Colors.heading,
  },
  inputTitle: {
    color: "grey",
    fontFamily: Fonts.text,
    fontSize: 14,
    flexShrink: 1,
  },
});
