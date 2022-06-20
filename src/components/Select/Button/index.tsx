import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CustomButton } from '../../CustomButton';
import { Colors } from '../../../constants/colors';
import { Fonts } from '../../../constants/fonts';
import { Constants } from '../../../constants';
import { FloatActionButton } from '../../FloatButton';
import ReactNativeModal from 'react-native-modal';

interface IItem {
  id: any;
  name: string;
}

export interface IOptionComponent {
  item: IItem;
  selected: string;
  change: (id: any, name: string) => any;
}

interface IProps {
  data: any[];
  onChangeSelect: (id: any) => void;
  title?: string;
  defaultValue?: string;
  color: string;
  icon: string;
  OptionComponent: ({
    item,
    selected,
    change,
  }: IOptionComponent) => JSX.Element;
}

export const FABSelect: React.FC<IProps> = ({
  data,
  icon,
  color,
  title = 'Selecionar',
  onChangeSelect,
  defaultValue = '',
  OptionComponent,
}) => {
  const [selected, setSelected] = useState(defaultValue);
  const [modalVisible, setModalVisible] = useState(false);

  function RenderOption({ item }: any) {
    return (
      <OptionComponent
        item={item}
        selected={selected}
        change={(id: any, name: any) => {
          setSelected(id);
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
    onChangeSelect(selected);
  }

  return (
    <>
      <FloatActionButton icon={icon} color={color} onPress={open} />
      <ReactNativeModal
        isVisible={modalVisible}
        statusBarTranslucent
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={Constants.ANIMATION_MODAL_DURATION}
        animationOutTiming={Constants.ANIMATION_MODAL_DURATION}
        onDismiss={close}
        onBackButtonPress={close}
        style={{ margin: 0 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            paddingTop: Constants.STATUS_BAR_HEIGHT,
          }}>
          <View style={{ ...styles.header }}>
            <CustomButton icon="close" onPress={close} />
            <Text style={styles.headerTitle}>{title}</Text>
            <CustomButton icon="check" onPress={save} />
          </View>
          <FlatList
            data={data}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <RenderOption item={item} />}
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: Fonts.heading,
    color: Colors.heading,
  },
});
