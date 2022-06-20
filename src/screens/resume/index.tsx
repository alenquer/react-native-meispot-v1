import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';
import { Constants } from '../../constants';
import { Fonts } from '../../constants/fonts';
import { VerticalProgress } from '../../components/Progress/Vertical';
import { ObservedList } from '../../components/Cards';
import { Header } from '../../components/Header';
import { sleep } from '../../utils';
import Loading from '../../components/Loading';
import useManager from '../../hooks/useManager';

const searchTypes = [
  {
    id: 'tasks',
    name: 'Tarefas',
  },
  {
    id: 'payments',
    name: 'Vendas',
  },
  {
    id: 'contacts',
    name: 'Contatos',
  },
];

export function ResumeScreen({ contacts, tasks, payments }: any) {
  const { clearManager } = useManager();

  const [searchType, setSearchType] = useState('tasks');

  const [loading, setLoading] = useState(true);

  const totalCount = contacts.length + tasks.length + payments.length;

  useEffect(() => {
    let isMounted = true;

    async function init() {
      await sleep(500);

      if (isMounted) {
        setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
      clearManager();
    };
  }, []);

  const SearchView: React.FC = () => {
    switch (searchType) {
      case 'contacts':
        return <ObservedList table="contacts" items={contacts} />;
      case 'tasks':
        return <ObservedList table="tasks" items={tasks} />;
      case 'payments':
        return <ObservedList table="payments" items={payments} />;
      default:
        throw new Error('Error on SearchView()');
    }
  };

  const Types: React.FC = () => {
    return (
      <View style={styles.calendarTypeContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarTypeContent}>
          {searchTypes.map(e => {
            let selected = searchType === e.id;

            return (
              <TouchableOpacity
                key={e.id}
                onPress={() => setSearchType(e.id)}
                style={{
                  ...styles.calendarType,
                  backgroundColor: selected ? Colors.green : Colors.shape,
                }}>
                <Text
                  style={{
                    ...styles.calendarText,
                    color: selected ? 'white' : '#949494',
                  }}>
                  {e.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const { deck, indices } = useMemo(() => {
    const indices: number[] = [];
    const items: IDeck[] = [
      {
        key: 'PROGRESS',
        render: () => {
          return (
            <View style={styles.graphContainer}>
              <View style={styles.graphHeader}>
                <Text style={styles.graphTitle}>Últimos 30 dias</Text>
              </View>
              <View style={styles.graphContent}>
                <VerticalProgress
                  style={styles.graphProgress}
                  color={'orange'}
                  icon={Constants.TASKS_ICON}
                  backgroundColor="rgba(164, 140, 4, 0.32)"
                  step={tasks.length}
                  steps={totalCount}
                />
                <VerticalProgress
                  style={styles.graphProgress}
                  icon={Constants.PAYMENTS_ICON}
                  color={Colors.blue}
                  backgroundColor="rgba(92, 126, 219, 0.32)"
                  step={payments.length}
                  steps={totalCount}
                />
                <VerticalProgress
                  style={styles.graphProgress}
                  icon={Constants.CONTACTS_ICON}
                  color={'red'}
                  backgroundColor="rgba(251, 91, 91, 0.32)"
                  step={contacts.length}
                  steps={totalCount}
                />
              </View>
              <Types />
            </View>
          );
        },
      },
      {
        key: 'ACTIVITIES',
        render: () => <SearchView />,
      },
    ];

    items.forEach((item, index) => item.isTitle && indices.push(index));

    return {
      deck: items,
      indices,
    };
  }, [searchType, totalCount]);

  return loading ? (
    <Loading />
  ) : (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header
        icon="filter-variant"
        title="Resumo"
        onPress={() => Alert.alert('', 'Disponível na proxima atualização.')}
      />
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
  divider: {
    width: '100%',
    height: 15,
  },
  calendarTypeContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.heading,
    color: Colors.heading,
  },
  graphContainer: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.shape,
  },
  graphProgress: {
    height: '100%',
    width: 50,
    borderRadius: 999,
  },
  graphContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  graphHeader: {
    position: 'relative',
    marginTop: 11,
    width: '100%',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarType: {
    marginRight: 5,
    borderRadius: 999,
    height: 25,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarText: { fontFamily: Fonts.heading },
  calendarTypeContainer: {
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: 'white',
    borderColor: Colors.shape,
  },
  graphTitle: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: '#949494',
  },
});
