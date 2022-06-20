import React, { useEffect, useReducer, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Switch } from 'react-native-gesture-handler';
import { useDatabase } from '@nozbe/watermelondb/hooks';

import uuid from 'react-native-uuid';

import { sleep } from '../../../utils';
import { AnimatedIcon } from '../../../utils/container';
import { Constants } from '../../../constants';
import { Colors } from '../../../constants/colors';
import { Fonts } from '../../../constants/fonts';
import { KeyboardAvoidingWrapper } from '../../../components/KeyboardAvoidingWrapper';
import { CustomButton } from '../../../components/CustomButton';
import { Header } from '../../../components/Header';

import useAnimation from '../../../hooks/useAnimation';
import Loading from '../../../components/Loading';
import GroupInput from '../../../components/Input';
import ContactModel from '../../../database/models/contact';

interface IParams {
  id: any;
}

const initialData = {
  star: false,
};

export function ContactScreen() {
  const database = useDatabase();
  const { params }: any = useRoute();
  const { setAnimation } = useAnimation();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const { id }: IParams = params;

  const _id = id ?? uuid.v4().toString();

  const [state, setState]: [ContactModel, any] = useReducer(function (
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
      default:
        return false;
    }
  }

  async function save() {
    try {
      setAnimation('loading');

      if (id) {
        const result = await database.get<ContactModel>('contacts').find(id);

        return await result.setUpdate({
          ...(state as any),
        });
      }

      return await database.write(async () => {
        await database.get<ContactModel>('contacts').create(record => {
          record._raw.id = _id;
          record.avatar = state.avatar;
          record.name = state.name;
          record.phone = state.phone;
          record.star = state.star;
          record.email = state.email;
          record.notes = state.notes;
          record.document = state.document;
        });
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
          let _result = await database.get<ContactModel>('contacts').find(id);

          let _data = await _result.getContact();

          if (isMounted) {
            setState({ type: 'data', data: _data });
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
        title={'Contato'}
        onPress={save}
        disabled={handleFields()}
        color={handleFields() ? Colors.green_light : Colors.green}
      />
      <KeyboardAvoidingWrapper contentContainerStyle={{ paddingBottom: 15 }}>
        <View style={styles.iconBackground}>
          <AnimatedIcon
            name={Constants.CONTACTS_ICON as any}
            size={Constants.PAGE_ICON_SIZE}
            color={Colors.green}
          />
        </View>
        <View>
          <GroupInput
            value={state.name}
            placeholder="Nome"
            onChangeText={name => setState({ type: 'data', data: { name } })}
            rightComponent={<CustomButton icon="format-title" />}
          />
          <GroupInput
            value={state.email}
            placeholder="E-mail"
            onChangeText={email => setState({ type: 'data', data: { email } })}
            rightComponent={<CustomButton icon="at" />}
          />
          <GroupInput
            placeholder="Telefone"
            style={{ backgroundColor: 'white' }}
            value={state.phone > 0 ? String(state.phone) : ''}
            keyboardType="number-pad"
            rightComponent={<CustomButton icon={'phone'} />}
            onChangeText={phone => setState({ type: 'data', data: { phone } })}
          />
          <GroupInput
            placeholder="Documento"
            value={state.document}
            rightComponent={<CustomButton icon="card-account-details" />}
            onChangeText={document =>
              setState({
                type: 'data',
                data: { document },
              })
            }
          />
          <GroupInput
            value={state.notes}
            style={{ backgroundColor: 'white' }}
            onChangeText={notes => setState({ type: 'data', data: { notes } })}
            multiline
            placeholder="Informações adicionais"
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
          <Text style={{ fontFamily: Fonts.heading, fontSize: 16 }}>
            Destaque
          </Text>
          <Switch
            value={state.star}
            thumbColor={state.star ? Colors.green : 'grey'}
            onValueChange={() =>
              setState({ type: 'data', data: { star: !state.star } })
            }
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
  title: {
    fontSize: 16,
    fontFamily: Fonts.heading,
    color: Colors.heading,
  },
  divider: {
    width: '100%',
    height: 15,
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
