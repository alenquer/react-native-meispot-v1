import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Switch } from 'react-native-gesture-handler';

import moment from 'moment';
import uuid from 'react-native-uuid';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { Orders } from './orders';
import { Contacts } from './contacts';

import { Colors } from '../../../constants/colors';
import { Constants } from '../../../constants';
import { Fonts } from '../../../constants/fonts';

import { AnimatedIcon } from '../../../utils/container';
import { ScreenWidth } from '../../../utils/layout';
import { ExtractNumbers, percentageOff, sleep } from '../../../utils';

import StatusContent, { StatusList } from '../../../@maps/Status';
import Method, { PayMethods } from '../../../@maps/Method';
import { CustomButton } from '../../../components/CustomButton';
import { InputSelect } from '../../../components/Select/Input';
import { KeyboardAvoidingWrapper } from '../../../components/KeyboardAvoidingWrapper';
import { LabelOptions } from '../../../components/Select/Components/Label';
import { Header } from '../../../components/Header';
import { setContacts } from './events/save/contacts';
import { setOrders } from './events/save/orders';
import { getContacts } from './events/load/contacts';
import { getOrders } from './events/load/orders';

import GroupInput from '../../../components/Input';
import Loading from '../../../components/Loading';
import useManager from '../../../hooks/useManager';
import useAuth from '../../../hooks/useAuth';
import useAnimation from '../../../hooks/useAnimation';
import PaymentModel from '../../../database/models/payment';

interface IParams {
  id: any;
}

const initialData = {
  star: false,
  cost: 0,
  control: true,
  extra: 0,
  fee: { type: 'mail', value: 0, to: 'client' },
  methods: [{ name: '' }],
  discount: { type: 'percent', value: 0 },
  status: 'pending',
};

export function PaymentScreen() {
  const database = useDatabase();
  const navigation = useNavigation();
  const { formatCurrency, settings } = useAuth();
  const { params }: any = useRoute();
  const { setAnimation } = useAnimation();
  const { setManager, clearManager, orders, contacts } = useManager();
  const [loading, setLoading] = useState(true);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const { id }: IParams = params;

  const [state, setState]: [PaymentModel, any] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case 'data': {
          return {
            ...state,
            ...action.data,
          };
        }
        default:
          throw new Error();
      }
    },
    initialData,
  );

  let _id = id ?? uuid.v4().toString();
  let _discount = state.discount as IDiscount;
  let _fee = state.fee as IFee;
  let _methods = state.methods as IMethod[];

  const _total = () => {
    return orders.total() + state.extra;
  };

  function _setState(data: any) {
    setState({ type: 'data', data });
  }

  function go(category: string) {
    setManager('add');
    navigation.navigate(category as never, {} as never);
  }

  async function setData() {
    const _newDiscount = JSON.stringify(_discount);
    const _newFee = JSON.stringify(_fee);
    const _newMethods = JSON.stringify(_methods);

    if (id) {
      return await database
        .get<PaymentModel>('payments')
        .find(id)
        .then(e =>
          e.prepareUpdate(payment => {
            payment.name = state.name;
            payment.description = state.description;
            payment.extra = state.extra;
            payment.star = state.star;
            payment.date = state.date;
            payment.fee = _newFee;
            payment.notes = state.notes;
            payment.discount = _newDiscount;
            payment.status = state.status;
            payment.methods = _newMethods;
          }),
        );
    }

    return database.collections
      .get<PaymentModel>('payments')
      .prepareCreate(payment => {
        payment._raw.id = _id;
        payment.name = state.name;
        payment.description = state.description;
        payment.extra = state.extra;
        payment.star = state.star;
        payment.date = state.date;
        payment.fee = _newFee;
        payment.notes = state.notes;
        payment.discount = _newDiscount;
        payment.status = state.status;
        payment.methods = _newMethods;
      });
  }

  async function save() {
    try {
      setAnimation('loading');
      const _contacts = await setContacts({ id: _id, database, contacts });
      const _stock = await setOrders({ id: _id, database, orders });
      const _state = await setData();

      await database.write(async () => {
        await database.batch(..._stock, ..._contacts, _state);
      });
    } catch (e) {
      throw new Error('An error ocurred: save()');
    } finally {
      setAnimation('');
      navigation.goBack();
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        if (id) {
          const _result = await database.get<PaymentModel>('payments').find(id);
          const _data = await _result.getPayment();
          const _contacts = await getContacts({ database, id: _id });
          const _orders = await getOrders({ database, id: _id });

          if (isMounted) {
            setState({
              type: 'data',
              data: {
                ..._data,
                discount: JSON.parse(_data.discount as string),
                fee: JSON.parse(_data.fee as string),
                methods: JSON.parse(_data.methods as string),
              },
            });
            contacts.set(_contacts);
            orders.set(_orders);
          }
        }
      } catch (e) {
        navigation.goBack();
      } finally {
        await sleep(500);

        if (isMounted) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
      clearManager();
    };
  }, []);

  // async function _updateCatalog() {
  //   const newStock: any[] = [];

  //   for (let i = 0; i < stock.data.length; i++) {
  //     const { id, qtd } = stock.data[i];

  //     try {
  //       const query = await database.get<CatalogModel>("catalogs").find(id);

  //       const result = await query.getCatalog();

  //       newStock.push({ ...result, qtd });
  //     } catch (e) {
  //       String(e).includes("found") && stock.remove(id);
  //     }
  //   }

  //   stock.set(JSON.stringify(newStock));
  // }

  let discountValue = () => {
    const { value, type } = _discount;

    switch (true) {
      case !value:
        return '';
      case type !== 'percent':
        return formatCurrency(value.toFixed(2))[0];
      default:
        return value;
    }
  };

  function _setDiscount(value: string, type: string) {
    const _value = ExtractNumbers(value);

    let newValue = _value / 100;

    if (type === 'percent') {
      newValue = Math.min(Math.max(_value, 0), 100);
    }

    _setState({ discount: { type, value: newValue } });
  }

  const DiscountButton: React.FC = () => {
    const { type } = _discount;

    let isPercent = type === 'percent';
    let _type = isPercent ? 'value' : 'percent';
    let _icon = isPercent ? 'percent' : 'cash-minus';

    return (
      <CustomButton
        color="orange"
        icon={_icon}
        onPress={() => _setState({ discount: { type: _type, value: 0 } })}
      />
    );
  };

  function fields() {
    switch (true) {
      case !state.name:
        return true;
      case !state.date && state.status === 'done':
        return true;
      default:
        return false;
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <Header
        icon="check"
        title="Pedido"
        onPress={save}
        color={fields() ? Colors.green_light : Colors.green}
        disabled={fields()}
      />
      <KeyboardAvoidingWrapper
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 15 }}>
        <View style={styles.iconBackground}>
          <AnimatedIcon
            name="currency-usd"
            size={Constants.PAGE_ICON_SIZE}
            color={StatusContent(state.status).color}
          />
        </View>
        <View>
          <GroupInput
            editable={false}
            rightComponent={<CustomButton icon="currency-usd" />}
            value={
              formatCurrency(
                percentageOff(
                  _discount.type,
                  _total(),
                  _discount.value,
                ).toFixed(2),
              )[0]
            }
          />
          <GroupInput
            rightComponent={<CustomButton icon="cash-plus" />}
            placeholder="Valor adicional"
            value={
              !state.extra ? '' : formatCurrency(state.extra.toFixed(2))[0]
            }
            onChangeText={e => _setState({ extra: ExtractNumbers(e) / 100 })}
            keyboardType="numeric"
          />
          <GroupInput
            rightComponent={<CustomButton icon="format-title" />}
            placeholder="Nome"
            value={state.name}
            onChangeText={name => _setState({ name })}
          />
          <GroupInput
            rightComponent={<CustomButton icon="text" />}
            placeholder="Descrição"
            value={state.description}
            onChangeText={description => _setState({ description })}
          />
          <GroupInput
            keyboardType="number-pad"
            rightComponent={<CustomButton icon="truck" />}
            placeholder={`Frete`}
            value={String(
              _fee.value > 0 ? formatCurrency(_fee.value.toFixed(2))[0] : '',
            )}
            onChangeText={e =>
              _setState({
                fee: {
                  type: _fee.type,
                  to: 'client',
                  value: ExtractNumbers(e) / 100,
                },
              })
            }
          />
          <GroupInput
            keyboardType="number-pad"
            rightComponent={<DiscountButton />}
            placeholder={`Desconto`}
            value={String(discountValue())}
            onChangeText={e => _setDiscount(e, _discount.type)}
          />
          <GroupInput
            placeholder="Data da conclusão"
            editable={false}
            value={
              state.date
                ? moment(state.date).locale(settings.language).format('LL')
                : ''
            }
            rightComponent={
              <CustomButton
                icon="calendar"
                onPress={() => setDatePickerVisible(true)}
              />
            }
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.titleHeader}>
          <Text style={styles.title}>Destaque</Text>
          <Switch
            thumbColor={state.star ? Colors.green : 'grey'}
            value={state.star}
            onValueChange={() => _setState({ star: !state.star })}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.titleHeader}>
          <Text style={styles.title}>Status</Text>
          <InputSelect
            text={StatusContent(state.status).name}
            defaultValue={state.status}
            data={StatusList}
            onChangeSelect={status => _setState({ status })}
            OptionComponent={LabelOptions}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.titleHeader}>
          <Text style={styles.title}>Método</Text>
          <InputSelect
            text={Method(_methods[0].name).name}
            defaultValue={_methods[0].name}
            data={PayMethods}
            onChangeSelect={name => _setState({ methods: [{ name }] })}
            OptionComponent={LabelOptions}
          />
        </View>
        <View style={styles.divider} />
        <View>
          <View style={styles.titleHeader}>
            <Text style={styles.title}>Clientes</Text>
            <CustomButton
              icon="plus"
              color={'white'}
              onPress={() => go('contacts')}
              style={{ backgroundColor: Colors.green, borderRadius: 999 }}
            />
          </View>
          <View style={styles.divider} />
          <Contacts data={contacts.data} />
        </View>
        <View style={styles.divider} />
        <View>
          <View style={styles.titleHeader}>
            <Text style={styles.title}>Pedidos</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  { marginHorizontal: 7, maxWidth: ScreenWidth(50) },
                ]}>
                {formatCurrency((_total() - state.extra).toFixed(2))[0]}
              </Text>
              <CustomButton
                icon="plus"
                color={'white'}
                onPress={() => go('catalogs')}
                style={{ backgroundColor: Colors.green, borderRadius: 999 }}
              />
            </View>
          </View>
          <View style={styles.divider} />
          <Orders data={orders.data} />
        </View>
      </KeyboardAvoidingWrapper>
      <DateTimePicker
        mode="date"
        isVisible={datePickerVisible}
        date={state.date ? new Date(state.date) : new Date()}
        onCancel={() => setDatePickerVisible(false)}
        onConfirm={date => {
          setDatePickerVisible(false);
          _setState({ type: 'data', date: new Date(date).getTime() });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  divider: {
    width: '100%',
    height: 15,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.heading,
    color: Colors.heading,
  },
  titleHeader: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    backgroundColor: '#f9f9fa',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});
