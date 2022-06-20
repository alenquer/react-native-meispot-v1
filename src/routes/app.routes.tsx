import React, { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Home } from '../screens/home';
import { Contacts } from '../screens/contacts';
import { ContactScreen } from '../screens/contacts/contact';
import { Catalogs } from '../screens/catalogs';
import { CatalogScreen } from '../screens/catalogs/catalog';
import { Payments } from '../screens/payments';
import { PaymentScreen } from '../screens/payments/payment';
import { Tasks } from '../screens/tasks';
import { TaskScreen } from '../screens/tasks/task';
import { SettingScreen } from '../screens/settings';

import { ObservedResumeScreen } from '../screens/resume/observables';

import { combinedDate } from '../utils';
import { TaskNotification } from '../notifications/task';
import { ManagerProvider } from '../contexts/manager';
import useAuth from '../hooks/useAuth';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import CustomDB from '../database';
import TaskModel from '../database/models/task';

const { Navigator, Screen } = createNativeStackNavigator();

export default function AppRoutes() {
  const { user, settings } = useAuth();
  const database = CustomDB(user.groups[0].id);

  useEffect(() => {
    PushNotification.getScheduledLocalNotifications(async notifications => {
      if (notifications.length === 0) {
        let tasks = await database.get<TaskModel>('tasks').query().fetch();

        for (let task of tasks) {
          let _combinedDate = combinedDate(task.date, task.time);
          let now = new Date().getTime();
          let old = new Date(_combinedDate).getTime();

          if (
            old > now &&
            task.status === 'pending' &&
            task.date &&
            task.time
          ) {
            TaskNotification(
              { title: task.name, ref: task.id },
              { date: new Date(_combinedDate) },
            );
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('@user', JSON.stringify(user));
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('@settings', JSON.stringify(settings));
    })();
  }, [settings]);

  useEffect(() => {
    (async () => {
      const hasItem = await AsyncStorage.getItem('@database');

      const myDatabase = { id: user.groups[0].id, date: new Date() };

      function toSave() {
        if (hasItem) {
          const data: any[] = JSON.parse(hasItem);

          return data.map(obj =>
            obj.id === myDatabase.id ? { ...obj, date: myDatabase.date } : obj,
          );
        }

        return [myDatabase];
      }

      await AsyncStorage.setItem('@database', JSON.stringify(toSave()));
    })();
  }, []);

  return (
    <DatabaseProvider database={database}>
      <ManagerProvider>
        <Navigator
          initialRouteName="home"
          screenOptions={{ headerShown: false }}>
          <Screen name="home" component={Home} />
          <Screen name="contacts" component={Contacts} />
          <Screen name="contact" component={ContactScreen} />
          <Screen name="catalogs" component={Catalogs} />
          <Screen name="catalog" component={CatalogScreen} />
          <Screen name="payments" component={Payments} />
          <Screen name="payment" component={PaymentScreen} />
          <Screen name="tasks" component={Tasks} />
          <Screen name="task" component={TaskScreen} />
          <Screen name="resume" component={ObservedResumeScreen} />
          <Screen name="settings" component={SettingScreen} />
        </Navigator>
      </ManagerProvider>
    </DatabaseProvider>
  );
}
