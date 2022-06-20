import React, { useEffect, useReducer, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Switch } from 'react-native-gesture-handler';
import { useDatabase } from '@nozbe/watermelondb/hooks';

import uuid from 'react-native-uuid';

import Unit, { Units } from '../../../@maps/Unit';
import Category, { Categories } from '../../../@maps/Category';
import { Constants } from '../../../constants';
import { Fonts } from '../../../constants/fonts';
import { Colors } from '../../../constants/colors';
import { CustomButton } from '../../../components/CustomButton';
import { InputSelect } from '../../../components/Select/Input';
import { ColorList } from '../../../components/Palette';
import { LabelOptions } from '../../../components/Select/Components/Label';
import { KeyboardAvoidingWrapper } from '../../../components/KeyboardAvoidingWrapper';
import { Header } from '../../../components/Header';
import { AnimatedIcon } from '../../../utils/container';
import { ExtractNumbers, sleep } from '../../../utils';

import useAnimation from '../../../hooks/useAnimation';
import useAuth from '../../../hooks/useAuth';
import GroupInput from '../../../components/Input';
import Loading from '../../../components/Loading';
import CatalogModel from '../../../database/models/catalog';

interface IParams {
  id: any;
}

const initialData = {
  value: 0,
  star: false,
  cost: 0,
  amount: 0,
  control: false,
  fill: Colors.green,
};

export function CatalogScreen() {
  const database = useDatabase();
  const navigation = useNavigation();
  const { settings, formatCurrency } = useAuth();
  const { setAnimation } = useAnimation();
  const { params }: any = useRoute();
  const [loading, setLoading] = useState(true);

  const { id }: IParams = params;
  const _id = id ?? uuid.v4().toString();

  const [state, setState]: [CatalogModel, any] = useReducer(function (
    state: any,
    action: any,
  ) {
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
  initialData);

  function handleFields() {
    switch (true) {
      case !state.name:
        return true;
      case !state.unit:
        return true;
      case !state.category as any:
        return true;
      default:
        return false;
    }
  }

  async function create() {
    try {
      setAnimation('loading');
      await database.write(async () => {
        await database.get<CatalogModel>('catalogs').create(record => {
          record._raw.id = _id;
          record.description = state.description;
          record.name = state.name;
          record.value = state.value;
          record.star = state.star;
          record.fill = state.fill;
          record.cost = state.cost;
          //record.amount = state.amount;
          //record.control = state.control;
          record.unit = state.unit;
          record.category = state.category;
        });
      });
    } catch (e) {
      Alert.alert('', 'An error ocurred!');
    } finally {
      setAnimation('');
      navigation.goBack();
    }
  }

  async function update() {
    try {
      setAnimation('loading');
      const result = await database.get<CatalogModel>('catalogs').find(id);

      await result.setUpdate({
        ...(state as any),
      });
    } catch (e) {
      console.log(e);
      Alert.alert('', 'An error ocurred!');
    } finally {
      setAnimation('');
      navigation.goBack();
    }
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (id) {
          let _result = await database.get<CatalogModel>('catalogs').find(id);

          const _catalog = await _result.getCatalog();

          if (isMounted) {
            setState({ type: 'data', data: _catalog });
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
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header
        icon="check"
        title="Catálogo"
        onPress={id ? update : create}
        disabled={handleFields()}
        color={handleFields() ? Colors.green_light : Colors.green}
      />
      <KeyboardAvoidingWrapper contentContainerStyle={{ paddingBottom: 15 }}>
        <View style={styles.bigIcon}>
          <AnimatedIcon
            name={Category(state.category).icon as any}
            size={90}
            color={state.fill}
          />
        </View>
        <View>
          <GroupInput
            border={{ top: 0 }}
            placeholder="Nome"
            value={state.name}
            rightComponent={
              <CustomButton color={Colors.green} disabled icon="format-title" />
            }
            onChangeText={name => setState({ type: 'data', data: { name } })}
          />
          <GroupInput
            placeholder="Descrição"
            border={{ top: 0 }}
            value={state.description}
            rightComponent={
              <CustomButton color={Colors.green} disabled icon="text" />
            }
            onChangeText={description =>
              setState({ type: 'data', data: { description } })
            }
          />
          <GroupInput
            placeholder="Valor unitário"
            value={
              state.value > 0
                ? formatCurrency(Number(state.value).toFixed(2))[0]
                : ''
            }
            border={{ top: 0 }}
            keyboardType="numeric"
            rightComponent={
              <CustomButton color={Colors.green} disabled icon="currency-usd" />
            }
            onChangeText={value =>
              setState({
                type: 'data',
                data: { value: ExtractNumbers(value) / 100 },
              })
            }
          />
          <GroupInput
            placeholder="Custo de produção"
            value={
              state.cost > 0
                ? formatCurrency(Number(state.cost).toFixed(2))[0]
                : ''
            }
            border={{ top: 0 }}
            keyboardType="numeric"
            rightComponent={
              <CustomButton
                color={Colors.red}
                disabled
                icon="currency-usd-off"
              />
            }
            onChangeText={cost =>
              setState({
                type: 'data',
                data: { cost: ExtractNumbers(cost) / 100 },
              })
            }
          />
          <GroupInput
            border={{ top: 0 }}
            placeholder="Identificação"
            value={state.code}
            rightComponent={
              <CustomButton color={Colors.green} disabled icon="qrcode" />
            }
            onChangeText={code => setState({ type: 'data', data: { code } })}
          />
          {/* <GroupInput
            placeholder="Quantidade"
            value={state.amount > 0 ? String(state.amount) : ""}
            border={{ top: 0 }}
            keyboardType="numeric"
            rightComponent={
              <CustomButton color={Colors.green} disabled icon="counter" />
            }
            onChangeText={(amount) =>
              setState({
                type: "data",
                data: { amount: ExtractNumbers(amount) },
              })
            }
          /> */}
        </View>
        <View style={styles.divider} />
        <ColorList
          fill={state.fill}
          onChangeSelect={(color: any) =>
            setState({ type: 'data', data: { fill: color } })
          }
        />
        <View style={styles.divider} />
        <View style={styles.category}>
          <Text style={styles.title}>Destaque</Text>
          <Switch
            value={state.star}
            thumbColor={state.star ? Colors.green : 'grey'}
            onValueChange={() =>
              setState({ type: 'data', data: { star: !state.star } })
            }
          />
        </View>
        <View style={styles.divider} />
        <View
          style={{
            marginHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.title}>Estoque</Text>
          <Switch
            thumbColor="grey"
            value={false}
            onValueChange={() =>
              Alert.alert(
                '',
                'Funcionalidade disponível na próxima atualização.',
              )
            }
            // onValueChange={() =>
            //   setState({ type: "data", data: { control: !state.control } })
            // }
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.category}>
          <Text style={styles.title}>Unidade</Text>
          <InputSelect
            text={Unit(state.unit).name}
            defaultValue={state.unit}
            data={Units}
            onChangeSelect={unit => setState({ type: 'data', data: { unit } })}
            OptionComponent={LabelOptions}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.category}>
          <Text style={styles.title}>Categoria</Text>
          <InputSelect
            text={Category(state.category).name}
            defaultValue={state.category}
            data={Categories}
            onChangeSelect={category =>
              setState({ type: 'data', data: { category } })
            }
            OptionComponent={LabelOptions}
          />
        </View>
      </KeyboardAvoidingWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  bigIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    backgroundColor: '#f9f9fa',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  category: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: Constants.STATUS_BAR_HEIGHT + 15,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
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
