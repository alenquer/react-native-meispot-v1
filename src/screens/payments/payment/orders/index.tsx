import React from 'react';
import { View } from 'react-native';
import { Empty } from '../../../../components/Empty';
import { ObservedOrder } from './order';

interface IProps {
  data: IStockProps[];
}

export function Orders({ data }: IProps) {
  let _data = data.filter(e => e.status !== 'deleted');

  if (!_data.length) return <Empty />;

  return (
    <>
      {_data.map((e, i) => {
        let divider = _data.length > 1 && i !== _data.length - 1 ? 15 : 0;

        return (
          <View key={e.catalog_id} style={{ marginBottom: divider }}>
            <ObservedOrder data={e} />
          </View>
        );
      })}
    </>
  );
}
