import React, { useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../constants/colors';
import { CustomButton } from '../../CustomButton';
import { percentageOff } from '../../../utils';
import { Constants } from '../../../constants';
import { Fonts } from '../../../constants/fonts';
import { Swipeable } from 'react-native-gesture-handler';
import { LeftActions } from '../Actions/LeftActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import withObservables from '@nozbe/with-observables';
import useAnimation from '../../../hooks/useAnimation';
import PaymentCatalogs from '../../../database/models/payment_catalogs';
import PaymentContacts from '../../../database/models/payment_contacts';
import Status from '../../../@maps/Status';
import useAuth from '../../../hooks/useAuth';
import PaymentModel from '../../../database/models/payment';

interface IComponent {
  item: PaymentModel;
  orders: PaymentCatalogs[];
  contacts: PaymentContacts[];
}

const Card: React.FC<IComponent> = ({ item, orders, contacts }) => {
  const { formatCurrency } = useAuth();
  const { setAnimation } = useAnimation();
  const navigation = useNavigation();

  const _ref = useRef<Swipeable>(null);

  function estimatedValue() {
    return orders
      .map((item: any) => (item.value - item.cost) * item.amount)
      .reduce((prev: number, next: number) => prev + next, 0);
  }

  async function deleteItem() {
    if (orders.length > 0 || contacts.length > 0) {
      Alert.alert('', 'Não é possível remover um item com vínculos.');
      return _ref.current?.close();
    }

    setAnimation('download');

    await item.delete();

    setAnimation('');
  }

  async function go() {
    return navigation.navigate('payment' as never, { id: item.id } as never);
  }

  let _discount: IDiscount = JSON.parse(item.discount as string);
  let _fee: IFee = JSON.parse(item.fee as string);

  return (
    <Swipeable
      ref={_ref}
      renderLeftActions={LeftActions}
      onSwipeableWillOpen={deleteItem}>
      <Pressable
        style={styles.container}
        onPress={go}
        android_ripple={{ color: Colors.shape }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
          <MaterialCommunityIcons
            name="currency-usd"
            size={Constants.CARD_ICON_SIZE / 2}
            color="white"
            style={{
              backgroundColor: Status(item.status).color,
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
              {
                formatCurrency(
                  percentageOff(
                    _discount.type,
                    estimatedValue() + item.extra,
                    _discount.value,
                  ).toFixed(2),
                )[0]
              }
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

export const PaymentCard = withObservables(['item'], ({ item }) => ({
  item,
  orders: item.orders,
  contacts: item.contacts,
}))(Card);

const styles = StyleSheet.create({
  container: {
    height: Constants.CARD_ITEM_HEIGHT,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
});
