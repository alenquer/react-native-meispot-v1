import React, { useEffect, useState, useCallback } from 'react';
import { FlatListProps, View } from 'react-native';
import { Constants } from '../../constants';
import { Pagination } from '../Pagination';
import { ContactCard } from './Contact';
import { CatalogCard } from './Catalog';
import { PaymentCard } from './Payment';
import { TaskCard } from './Task';
import { SkeletonCard } from '../../skeletons/card';
import { ScreenHeight } from '../../utils/layout';
import { sleep } from '../../utils';
import { Empty } from '../Empty';
import { AnimatedFlatList } from '../../utils/container';
import AnimatedLottieView from 'lottie-react-native';
import loadAnimation from '../../assets/lottie/database.json';

interface IProps extends Omit<FlatListProps<any>, 'data' | 'renderItem'> {
  items?: any;
  mode?: string;
  table: string;
}

export const ObservedList: React.FC<IProps> = ({
  items,
  table,
  mode,
  ...rest
}) => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showPagination, setShowPagination] = useState(false);
  const _keyExtractor = useCallback(item => item.id, []);
  const _getItemLayout = useCallback((_, index) => {
    return {
      length: Constants.CARD_ITEM_HEIGHT,
      offset: Constants.CARD_ITEM_HEIGHT * index,
      index,
    };
  }, []);

  const _renderItem = useCallback(({ item }) => {
    switch (table) {
      case 'contacts':
        return <ContactCard item={item} />;
      case 'catalogs':
        return <CatalogCard item={item} />;
      case 'payments':
        return <PaymentCard item={item} />;
      case 'tasks':
        return <TaskCard item={item} />;
      default:
        throw new Error('An error ocurred on render card');
    }
  }, []);

  const _currentPage = (data: any[]) => {
    let _start = (page - 1) * Constants.INITIAL_ITEM_RENDER;
    let _end = _start + Constants.INITIAL_ITEM_RENDER;

    return data.slice(_start, _end);
    //.sort((a, b) => Number(b.star) - Number(a.star));
  };

  const _totalPages = Math.ceil(items.length / Constants.INITIAL_ITEM_RENDER);

  const prevCondition = page <= 1;
  const nextCondition = page >= _totalPages;

  useEffect(() => {
    let isMounted = true;
    let current = _currentPage(items);

    async function init() {
      if (loading && items.length > 0) {
        return await sleep(500);
      }

      if (page > 1 && current.length < 1) {
        setPage(page - 1);
      }
    }

    init().finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return function cleanup() {
      isMounted = false;
    };
  }, [items, page]);

  const LoadingList: React.FC = () => {
    if (mode === 'text') {
      return loading ? <SkeletonCard /> : <Empty />;
    }

    return (
      <AnimatedLottieView
        loop
        autoPlay
        source={loadAnimation}
        style={{
          backgroundColor: 'transparent',
          width: '100%',
          height: ScreenHeight(40),
          alignSelf: 'center',
          margin: 15,
        }}
      />
    );
  };

  function back() {
    if (!prevCondition) {
      setShowPagination(false);
      setPage(page - 1);
    }
  }

  function next() {
    if (!nextCondition) {
      setShowPagination(false);
      setPage(page + 1);
    }
  }

  const HandlePagination: React.FC = () => {
    if (showPagination) {
      return (
        <View style={{ marginBottom: 10 }}>
          <Pagination
            page={page}
            totalPages={_totalPages}
            leftAction={back}
            rightAction={next}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <AnimatedFlatList
      nestedScrollEnabled
      initialNumToRender={Constants.INITIAL_ITEM_RENDER}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      data={loading ? [] : _currentPage(items)}
      getItemLayout={_getItemLayout}
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      onContentSizeChange={(w, h) => {
        const { HEADER_MAX_HEIGHT, INITIAL_ITEM_RENDER, CARD_ITEM_HEIGHT } =
          Constants;

        let size = h - HEADER_MAX_HEIGHT;
        let maxSize = CARD_ITEM_HEIGHT * INITIAL_ITEM_RENDER;

        if ((size >= maxSize || page > 1) && !showPagination) {
          setShowPagination(true);
        }
      }}
      ListEmptyComponent={LoadingList}
      ListFooterComponent={HandlePagination}
      {...rest}
    />
  );
};
