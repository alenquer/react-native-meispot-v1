import React, { useEffect, useReducer, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Switch, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDatabase } from '@nozbe/watermelondb/hooks';

import DateTimePicker from 'react-native-modal-datetime-picker';
import PushNotification from 'react-native-push-notification';
import uuid from 'react-native-uuid';
import moment from 'moment';

import Status, { StatusList } from '../../../@maps/Status';
import { CustomButton } from '../../../components/CustomButton';
import { InputSelect } from '../../../components/Select/Input';
import { LabelOptions } from '../../../components/Select/Components/Label';
import { Header } from '../../../components/Header';
import { Colors } from '../../../constants/colors';
import { Constants } from '../../../constants';
import { Fonts } from '../../../constants/fonts';
import { combinedDate, sleep } from '../../../utils';
import { AnimatedIcon } from '../../../utils/container';
import { TaskNotification } from '../../../notifications/task';

import Loading from '../../../components/Loading';
import GroupInput from '../../../components/Input';
import useAnimation from '../../../hooks/useAnimation';
import useAuth from '../../../hooks/useAuth';
import TaskModel from '../../../database/models/task';

interface IParams {
  id: any;
}

const initialData = {
  type: 'single',
  status: 'pending',
  star: false,
};

export function TaskScreen() {
  const database = useDatabase();
  const navigation = useNavigation();
  const { settings } = useAuth();
  const { params }: any = useRoute();
  const { setAnimation } = useAnimation();

  const [datePickerVisible, setDatePickerVisible] = useState('');
  const [loading, setLoading] = useState(true);

  const { id }: IParams = params;

  const _id = id ?? uuid.v4().toString();

  const [state, setState]: [TaskModel, any] = useReducer(function (
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

  function fields() {
    switch (true) {
      case !state.name:
        return true;
      default:
        return false;
    }
  }

  function _setState(data: any) {
    setState({ type: 'data', data });
  }

  function handleNotifications() {
    PushNotification.getScheduledLocalNotifications(notifications => {
      if (id) {
        for (let e of notifications) {
          if (e.data.task_id === _id) {
            PushNotification.cancelLocalNotification(e.id);
          }
        }
      }

      if (state.status === 'pending' && state.date && state.time) {
        const date = new Date(combinedDate(state.date, state.time));

        TaskNotification({ title: state.name, ref: _id }, { date });
      }
    });
  }

  async function save() {
    try {
      setAnimation('loading');

      handleNotifications();

      if (id) {
        return await database
          .get<TaskModel>('tasks')
          .find(id)
          .then(async e => e.setUpdate({ ...(state as any) }));
      }

      return await database.write(async () => {
        await database.get<TaskModel>('tasks').create(record => {
          record._raw.id = _id;
          record.name = state.name;
          record.date = state.date;
          record.time = state.time;
          record.type = state.type;
          record.star = state.star;
          record.notes = state.notes;
          record.status = state.status;
        });
      });
    } catch (e) {
      Alert.alert('', 'An error ocurred!');
    } finally {
      setAnimation('');
      navigation.goBack();
    }
  }

  async function confirmExit() {
    if (!state.date || !state.time) {
      return Alert.alert(
        '',
        'É necessário informar data e hora para agendar uma tarefa.',
        [
          {
            text: 'Continuar editando',
            onPress: () => null,
          },
          {
            style: 'cancel',
            text: 'Salvar',
            onPress: save,
          },
        ],
        { cancelable: false },
      );
    }

    return await save();
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (id) {
          let _result = await database.get<TaskModel>('tasks').find(id);
          let _data = await _result.getTask();

          if (isMounted) {
            _setState(_data);
          }
        }
      } catch (e) {
        navigation.goBack();
      } finally {
        await sleep(1000);

        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDate(date: Date) {
    setDatePickerVisible('');

    const _toMillis = date.getTime();

    switch (datePickerVisible) {
      case 'date':
        return _setState({ date: _toMillis });
      case 'time':
        return _setState({ time: _toMillis });
      default:
        return _setState({ time: _toMillis, date: _toMillis });
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <Header
        icon="check"
        title="Tarefa"
        onPress={confirmExit}
        disabled={fields()}
        color={fields() ? Colors.green_light : Colors.green}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 15 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.iconBackground}>
          <AnimatedIcon
            name={Constants.TASKS_ICON as any}
            size={Constants.PAGE_ICON_SIZE}
            color={Colors.green}
          />
        </View>
        <View>
          <GroupInput
            value={state.name}
            placeholder="Nome"
            onChangeText={name => _setState({ name })}
            rightComponent={<CustomButton icon="format-title" />}
          />
          <GroupInput
            value={state.notes}
            style={{ backgroundColor: 'white' }}
            onChangeText={notes => _setState({ notes })}
            multiline
            placeholder="Informações adicionais"
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.itemCategory}>
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
        <View style={styles.divider} />
        <View style={styles.itemCategory}>
          <Text style={styles.title}>Status</Text>
          <InputSelect
            text={Status(state.status).name}
            defaultValue={state.status}
            data={StatusList}
            onChangeSelect={status =>
              setState({ type: 'data', data: { status } })
            }
            OptionComponent={LabelOptions}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.itemCategory}>
          <Text style={{ fontFamily: Fonts.heading, fontSize: 16 }}>Data</Text>
          <Text
            numberOfLines={1}
            style={{ fontFamily: Fonts.heading, fontSize: 14, flexShrink: 1 }}>
            {state.date
              ? moment(state.date).locale(settings.language).format('LL')
              : '-'}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.itemCategory}>
          <Text style={{ fontFamily: Fonts.heading, fontSize: 16 }}>Hora</Text>
          <Text
            numberOfLines={1}
            style={{ fontFamily: Fonts.heading, fontSize: 14, flexShrink: 1 }}>
            {state.time
              ? moment(state.time).locale(settings.language).format('LTS')
              : '-'}
          </Text>
        </View>
        <View style={styles.divider} />
        <ScrollView horizontal contentContainerStyle={{ paddingLeft: 15 }}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setDatePickerVisible('date')}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: 'white',
                fontFamily: Fonts.heading,
              }}>
              Selecionar data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { marginLeft: 5 }]}
            onPress={() => setDatePickerVisible('time')}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: Fonts.heading,
                fontSize: 12,
                color: 'white',
              }}>
              Selecionar hora
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
      <DateTimePicker
        mode={datePickerVisible as any}
        isVisible={datePickerVisible !== ''}
        date={new Date()}
        onCancel={() => setDatePickerVisible('')}
        onConfirm={handleDate}
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
  title: {
    fontSize: 16,
    fontFamily: Fonts.heading,
  },
  divider: {
    width: '100%',
    height: 15,
  },
  itemCategory: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: 15,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green,
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
