import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewProps,
  TouchableOpacity,
} from 'react-native';

import withObservables from '@nozbe/with-observables';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

import { ExtractNumbers } from '../../../../../utils';
import { Colors } from '../../../../../constants/colors';
import { Constants } from '../../../../../constants';
import { Fonts } from '../../../../../constants/fonts';
import useManager from '../../../../../hooks/useManager';
import useAuth from '../../../../../hooks/useAuth';
import Category from '../../../../../@maps/Category';
import Unit from '../../../../../@maps/Unit';
import CatalogModel from '../../../../../database/models/catalog';

interface IProps extends ViewProps {
  data: IStockProps;
  catalog: CatalogModel;
}

export const Order: React.FC<IProps> = ({ data, catalog }) => {
  const { orders } = useManager();
  const { formatCurrency } = useAuth();

  const _category = Category(catalog.category);
  const _control = false;
  //const _control = data.amount > catalog.amount && catalog.control;
  const _value = ((data.value - data.cost) * data.amount).toFixed(2);

  function update() {
    orders.update(data.catalog_id, {
      amount: 1,
      value: catalog.value,
      cost: catalog.cost,
      status: 'created',
      catalog_id: catalog.id,
    });
  }

  function deleteItem() {
    return Alert.alert(
      catalog.name,
      'Deseja remover o item selecionado?',
      [
        {
          text: 'Remover',
          onPress: () => orders.remove(data.catalog_id),
        },
        {
          text: 'Atualizar',
          onPress: () => update(),
        },
        {
          text: 'Continuar editando',
          onPress: () => console.log('No, continue editing'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialCommunityIcons
          name={_category.icon as any}
          size={Constants.CARD_ICON_SIZE / 2}
          color="white"
          style={{
            backgroundColor: catalog.fill,
            padding: Constants.CARD_ICON_SIZE / 4,
            borderRadius: 999,
          }}
        />
        <View style={{ marginHorizontal: 10, flexShrink: 1 }}>
          <Text numberOfLines={1} style={styles.title}>
            {`${formatCurrency(_value)[0]} / ${Unit(catalog.unit).name}`}
          </Text>
          <Text numberOfLines={1} style={styles.name}>
            {catalog.name}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={[
            styles.amount,
            {
              backgroundColor: _control ? Colors.red : '#eee',
              marginHorizontal: 7,
            },
          ]}>
          <TextInput
            onChangeText={qtd =>
              orders.update(catalog.id, {
                amount: ExtractNumbers(qtd),
              })
            }
            value={String(data.amount)}
            keyboardType="numeric"
            style={[styles.boxNumber, { color: _control ? 'white' : 'grey' }]}
          />
        </View>
        <TouchableOpacity
          onPress={deleteItem}
          style={[
            styles.amount,
            {
              backgroundColor: Colors.green,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <MaterialCommunityIcons name="tools" color="white" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const ObservedOrder = withDatabase(
  withObservables(['database', 'data'], ({ database, data }) => ({
    catalog: database.get('catalogs').findAndObserve(data.catalog_id),
  }))(Order),
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  name: {
    fontFamily: Fonts.text,
    fontSize: 14,
    color: Colors.heading,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 14,
    color: Colors.heading,
  },
  amount: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  boxNumber: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 12,
  },
});
