import React, { useRef } from 'react';
import withObservables from '@nozbe/with-observables';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../constants/colors';
import { CustomButton } from '../../CustomButton';
import { LimitCase } from '../../../utils';
import { Constants } from '../../../constants';
import { Swipeable } from 'react-native-gesture-handler';
import { LeftActions } from '../Actions/LeftActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts } from '../../../constants/fonts';
import useManager from '../../../hooks/useManager';
import CatalogModel from '../../../database/models/catalog';
import useAnimation from '../../../hooks/useAnimation';
import Category from '../../../@maps/Category';
import Unit from '../../../@maps/Unit';
import useAuth from '../../../hooks/useAuth';
import PaymentModel from '../../../database/models/payment';

interface IComponent {
  item: CatalogModel;
  payments: PaymentModel[];
}

const Card: React.FC<IComponent> = ({ item, payments }) => {
  const navigation: any = useNavigation();
  const { formatCurrency } = useAuth();
  const { setAnimation } = useAnimation();
  const { manager, orders } = useManager();

  const _ref = useRef<Swipeable>(null);

  let _order = orders.find(item.id);

  const _ignore = () => {
    switch (true) {
      case manager === 'add':
        if (!_order) return false;
        return _order.status === 'deleted' ? false : true;
      default:
        return false;
    }
  };

  const _data = {
    amount: 1,
    value: item.value,
    cost: item.cost,
    status: 'created',
    catalog_id: item.id,
  };

  async function deleteItem() {
    if (payments.length > 0) {
      Alert.alert('', 'Não é possível remover um item com vínculos.');
      return _ref.current?.close();
    }

    setAnimation('download');

    await item.delete();

    setAnimation('');
  }

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
          onPress: () => orders.remove(item.id),
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
        return _order
          ? orders.update(item.id, { ..._data, _status: 'created' })
          : orders.add({ ..._data });
      default:
        return navigation.navigate('catalog', { id: item.id });
    }
  }

  return (
    <Swipeable
      ref={_ref}
      enabled={!_ignore()}
      renderLeftActions={LeftActions}
      onSwipeableLeftWillOpen={deleteItem}>
      <Pressable
        style={styles.container}
        onPress={go}
        android_ripple={{ color: Colors.shape }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
          <MaterialCommunityIcons
            name={_ignore() ? 'close' : (Category(item.category).icon as any)}
            size={Constants.CARD_ICON_SIZE / 2}
            color="white"
            style={{
              backgroundColor: _ignore() ? Colors.red : item.fill,
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
              {`${LimitCase(
                formatCurrency((item.value - item.cost).toFixed(2))[0],
                18,
              )} / ${Unit(item.unit).name}`}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.text,
                fontSize: 14,
                color: Colors.heading,
              }}
              numberOfLines={1}>
              {item.name}
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

export const CatalogCard = withObservables(['item'], ({ item }) => ({
  item,
  payments: item.payments,
}))(Card);

const styles = StyleSheet.create({
  container: {
    height: Constants.CARD_ITEM_HEIGHT,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
});
