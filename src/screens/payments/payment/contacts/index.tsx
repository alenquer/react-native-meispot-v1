import React from 'react';
import { ScrollView, View } from 'react-native';
import { ObservedContact } from './contact';
import { Empty } from '../../../../components/Empty';

interface IProps {
  data: IContactProps[];
}

export function Contacts({ data }: IProps) {
  let _data = data.filter(e => e.status !== 'deleted');

  if (!_data.length) return <Empty />;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingLeft: 15 }}>
      {_data.map((e, i) => {
        let divider = _data.length - 1 === i ? 15 : 10;

        return (
          <View key={e.contact_id} style={{ marginRight: divider }}>
            <ObservedContact data={e} />
          </View>
        );
      })}
    </ScrollView>
  );
}
