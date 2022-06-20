import React, { useRef } from 'react';
import withObservables from '@nozbe/with-observables';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../constants/colors';
import { CustomButton } from '../../CustomButton';
import { Constants } from '../../../constants';
import { Swipeable } from 'react-native-gesture-handler';
import { LeftActions } from '../Actions/LeftActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts } from '../../../constants/fonts';
import useAnimation from '../../../hooks/useAnimation';
import TaskModel from '../../../database/models/task';
import Status from '../../../@maps/Status';
import PushNotification from 'react-native-push-notification';

interface IComponent {
  item: TaskModel;
}

const Card: React.FC<IComponent> = ({ item }) => {
  const navigation: any = useNavigation();
  const { setAnimation } = useAnimation();

  const _ref = useRef<Swipeable>(null);

  async function deleteItem() {
    setAnimation('loading');

    try {
      PushNotification.getScheduledLocalNotifications(notifications => {
        for (let notification of notifications) {
          if (notification.data.task_id === item.id) {
            PushNotification.cancelLocalNotification(notification.id);
          }
        }
      });

      await item.delete();
    } catch (e) {
      throw new Error('Error on TaskCard()');
    } finally {
      setAnimation('');
    }
  }

  async function go() {
    return navigation.navigate('task', { id: item.id });
  }

  return (
    <Swipeable
      ref={_ref}
      renderLeftActions={LeftActions}
      onSwipeableLeftWillOpen={deleteItem}>
      <Pressable
        onPress={go}
        android_ripple={{ color: Colors.shape }}
        style={styles.container}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
          <MaterialCommunityIcons
            name="circle"
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
              style={[styles.text, { fontFamily: Fonts.heading }]}
              numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              style={[styles.text, { fontFamily: Fonts.text }]}
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

export const TaskCard = withObservables(['item'], ({ item }) => ({
  item,
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
  text: {
    fontSize: 14,
    color: Colors.heading,
  },
});
