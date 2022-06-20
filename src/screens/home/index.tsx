import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Constants } from '../../constants';
import { Colors } from '../../constants/colors';
import { Activities } from '../../components/Activities';
import { Fonts } from '../../constants/fonts';
import { Shortcuts } from '../../components/Shortcuts';
import { CustomButton } from '../../components/CustomButton';
import { DailyTasks } from './tasks';
import useAuth from '../../hooks/useAuth';

export function Home() {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const [currentMillis, setCurrentMillis] = useState(new Date());

  useEffect(() => {
    const changeDay = setInterval(() => {
      if (new Date().getDay() !== currentMillis.getDay()) {
        setCurrentMillis(new Date());
      }
    }, 30 * 1000);

    return () => {
      clearInterval(changeDay);
    };
  }, [currentMillis]);

  const { deck, indices } = useMemo(() => {
    const indices: number[] = [];
    const items: IDeck[] = [
      {
        key: 'HEADER',
        render: () => (
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name="crosshairs"
                size={30}
                color={Colors.green}
              />
              <Text style={styles.headerTitle}>MEI Spot</Text>
            </View>
            <CustomButton
              icon="location-exit"
              size={24}
              color={Colors.red}
              onPress={signOut}
            />
          </View>
        ),
      },
      {
        key: 'SHORTCUTS',
        render: () => <Shortcuts marginVertical={15} />,
      },
      {
        key: 'ACTIVITIES',
        render: () => <Activities margin={15} />,
      },
      {
        key: 'FAVORITES',
        render: () => <Text style={styles.title}>Tarefas do dia</Text>,
      },
      {
        key: 'daily-tasks',
        render: () => (
          <DailyTasks
            table="tasks"
            mode="text"
            startDay={currentMillis.setHours(0, 0, 0)}
            endDay={currentMillis.setHours(23, 59, 59)}
          />
        ),
      },
    ];

    items.forEach((item, index) => item.isTitle && indices.push(index));

    return {
      deck: items,
      indices,
    };
  }, [navigation, currentMillis]);

  return (
    <View style={styles.container}>
      <FlatList<IDeck>
        data={deck}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={indices}
        keyExtractor={item => item.key}
        renderItem={({ item }) => item.render()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.STATUS_BAR_HEIGHT,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.heading,
    fontSize: 18,
    color: Colors.green,
    marginHorizontal: 10,
  },
  title: {
    color: Colors.green,
    fontSize: 16,
    fontFamily: Fonts.heading,
    textTransform: 'uppercase',
    padding: 15,
    backgroundColor: 'white',
  },
});
