import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from '../CustomButton';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Q } from '@nozbe/watermelondb';
import { betweenDays, percentageOff } from '../../utils';
import useAuth from '../../hooks/useAuth';

const tables = ['payments', 'contacts'];

export function Activities({ ...rest }: ViewStyle) {
  const database = useDatabase();
  const { formatCurrency } = useAuth();

  const [receipt, setReceipt] = useState(0);
  const [contacts, setContacts] = useState(0);
  const [payments, setPayments] = useState(0);

  async function _load() {
    const { start, end } = betweenDays(30);

    for (let table of tables) {
      const count: any = database.collections.get(table);

      if (table === 'payments') {
        let receipts: string[] = [];

        const items = await count
          .query(
            Q.where('status', Q.like('done')),
            Q.where('date', Q.between(start, end)),
          )
          .fetch();

        for (let item of items) {
          let val = await item.orders.fetch();
          let _discount: IDiscount = JSON.parse(item.discount as string);

          let estimatedValue = val
            .map((item: any) => (item.value - item.cost) * item.amount)
            .reduce((prev: number, next: number) => prev + next, 0);

          function getPercent() {
            const { type, value } = _discount;
            return percentageOff(type, estimatedValue + item.extra, value);
          }

          receipts.push(getPercent().toFixed(2));
        }

        let totalValue = receipts
          .map((item: any) => parseFloat(item))
          .reduce((prev: number, next: number) => prev + next, 0);

        setPayments(items.length);
        setReceipt(totalValue);
      } else if (table === 'contacts') {
        const items = await count
          .query(Q.where('created_at', Q.between(start, end)))
          .fetch();
        setContacts(items.length);
      }
    }
  }

  useEffect(() => {
    _load();
  }, []);

  return (
    <View style={[styles.container, { ...rest }]}>
      <View style={styles.category}>
        <Text numberOfLines={1} style={styles.cardTitle}>
          Últimos 30 dias
        </Text>
        <CustomButton icon="refresh" onPress={_load} />
      </View>
      <View style={styles.category}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="currency-usd"
            size={16}
            color="white"
            style={{
              backgroundColor: Colors.green,
              borderRadius: 999,
              padding: 2,
            }}
          />
          <Text style={[styles.title, { color: Colors.green }]}>Receita</Text>
        </View>
        <Text numberOfLines={1} style={[styles.title, { color: Colors.green }]}>
          {formatCurrency(receipt.toFixed(2))[0]}
        </Text>
      </View>
      <View style={styles.category}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="currency-usd"
            size={16}
            color="white"
            style={{ backgroundColor: 'orange', borderRadius: 999, padding: 2 }}
          />
          <Text style={[styles.title, { color: 'orange' }]}>Vendas</Text>
        </View>
        <Text style={[styles.title, { color: 'orange' }]}>{payments}</Text>
      </View>
      <View style={[styles.category, { borderBottomWidth: 0 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="account"
            size={16}
            color="white"
            style={{
              backgroundColor: Colors.blue,
              borderRadius: 999,
              padding: 2,
            }}
          />
          <Text style={[styles.title, { color: Colors.blue }]}>
            Novos contatos
          </Text>
        </View>
        <Text style={[styles.title, { color: Colors.blue }]}>{contacts}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 11,
    padding: 15,
    elevation: 3,
    backgroundColor: Colors.shape,
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#dadada',
  },
  cardTitle: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.green,
  },
  title: {
    fontFamily: Fonts.text,
    fontSize: 14,
    marginHorizontal: 5,
  },
});
