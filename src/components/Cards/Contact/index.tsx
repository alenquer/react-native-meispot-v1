import React, { useRef, useState } from 'react';
import withObservables from '@nozbe/with-observables';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../constants/colors';
import { CustomButton } from '../../CustomButton';
import { Alert, Pressable, Text, View } from 'react-native';
import { Constants } from '../../../constants';
import { Fonts } from '../../../constants/fonts';
import { Swipeable } from 'react-native-gesture-handler';
import { LeftActions } from '../Actions/LeftActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ContactModel from '../../../database/models/contact';
import useManager from '../../../hooks/useManager';
import useAnimation from '../../../hooks/useAnimation';
import PaymentModel from '../../../database/models/payment';

interface IComponent {
  item: ContactModel;
  payments: PaymentModel[];
}

const Card: React.FC<IComponent> = ({ item, payments }) => {
  const navigation: any = useNavigation();
  const { manager, contacts } = useManager();
  const { setAnimation } = useAnimation();

  const _item = contacts.find(item.id);
  const _ref = useRef<Swipeable>(null);

  const _data = {
    contact_id: item.id,
    status: 'created',
  };

  const _ignore = () => {
    switch (true) {
      case manager === 'add':
        if (!_item) return false;
        return _item.status === 'deleted' ? false : true;
      default:
        return false;
    }
  };

  function _alert() {
    return Alert.alert(
      '',
      'Deseja remover este item?',
      [
        {
          text: 'Não',
          onPress: () => console.log('No, continue editing'),
        },
        {
          text: 'Sim',
          onPress: () => contacts.remove(item.id),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }

  async function go() {
    switch (true) {
      case _ignore():
        return _alert();
      case manager === 'add':
        return _item
          ? contacts.update(item.id, { ..._data })
          : contacts.add({ ..._data });
      default:
        return navigation.navigate('contact', { id: item.id });
    }
  }

  async function deleteItem() {
    if (payments.length > 0) {
      Alert.alert('', 'Não é possível remover um item com vínculos.');
      return _ref.current?.close();
    }

    setAnimation('download');

    await item.delete();

    setAnimation('');
  }

  return (
    <Swipeable
      ref={_ref}
      enabled={!_ignore()}
      renderLeftActions={LeftActions}
      onSwipeableLeftWillOpen={deleteItem}>
      <Pressable
        style={{
          height: Constants.CARD_ITEM_HEIGHT,
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
        }}
        onPress={go}
        android_ripple={{ color: Colors.shape }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
          <MaterialCommunityIcons
            name={_ignore() ? 'close' : (Constants.CONTACTS_ICON as any)}
            size={Constants.CARD_ICON_SIZE / 2}
            color="white"
            style={{
              backgroundColor: _ignore() ? Colors.red : Colors.green,
              padding: Constants.CARD_ICON_SIZE / 4,
              borderRadius: 999,
            }}
          />
          <View style={{ marginHorizontal: 10, flexShrink: 1 }}>
            <Text
              style={{
                fontFamily: Fonts.heading,
                fontSize: 14,
                color: Colors.heading,
              }}
              numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.text,
                fontSize: 14,
                color: Colors.heading,
              }}
              numberOfLines={1}>
              {item.notes !== '' ? item.notes : 'Sem informações adicionais'}
            </Text>
          </View>
        </View>
        <CustomButton
          disabled
          icon={item.star ? 'star' : 'star-outline'}
          color={item.star ? 'orange' : Colors.heading}
        />
      </Pressable>
    </Swipeable>
  );
};

export const ContactCard = withObservables(['item'], ({ item }) => ({
  item,
  payments: item.payments,
}))(Card);
