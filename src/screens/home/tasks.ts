import withObservables from '@nozbe/with-observables';
import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { ObservedList } from '../../components/Cards';

interface IObservables {
  database: Database;
  startDay: number;
  endDay: number;
}

const enhance = withObservables(
  ['database', 'startDay', 'endDay'],
  ({ database, startDay, endDay }: IObservables) => ({
    items: database.collections
      .get('tasks')
      .query(
        Q.sortBy('star', Q.desc),
        Q.sortBy('date', Q.desc),
        Q.where('date', Q.between(startDay, endDay)),
        Q.where('status', Q.like('pending')),
      ),
  }),
);

export const DailyTasks = withDatabase(enhance(ObservedList));
