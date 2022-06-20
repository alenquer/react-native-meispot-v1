import React from 'react';
import withObservables from '@nozbe/with-observables';
import { Database, Q } from '@nozbe/watermelondb';
import { ResumeScreen } from '.';
import { betweenDays } from '../../utils';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import useManager from '../../hooks/useManager';

interface IObservables {
  start: number;
  end: number;
  database: Database;
}

const EnhancedScreen = withObservables(
  ['database', 'start', 'end'],
  ({ database, start, end }: IObservables) => ({
    contacts: database.collections
      .get('contacts')
      .query(
        Q.sortBy('star', Q.desc),
        Q.where('created_at', Q.between(start, end)),
      ),
    tasks: database.collections
      .get('tasks')
      .query(
        Q.sortBy('star', Q.desc),
        Q.or(
          Q.where('date', Q.between(start, end)),
          Q.where('created_at', Q.between(start, end)),
        ),
      ),
    payments: database.collections
      .get('payments')
      .query(Q.sortBy('star', Q.desc), Q.where('date', Q.between(start, end))),
  }),
)(ResumeScreen);

export const ObservedResumeScreen: React.FC = () => {
  const database = useDatabase();
  const { search } = useManager();

  const filter = () => {
    switch (search.type) {
      case 'month':
        return betweenDays(30);
      default:
        return search;
    }
  };

  return (
    <EnhancedScreen
      database={database}
      start={filter().start}
      end={filter().end}
      type={search.type}
    />
  );
};
