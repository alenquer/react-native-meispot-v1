import withObservables from '@nozbe/with-observables';
import { Database, Q } from '@nozbe/watermelondb';
import { ObservedList } from '..';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

interface IObservables {
  filter: string;
  status: string;
  database: Database;
}

const enhance = withObservables(
  ['database', 'filter', 'status'],
  ({ database, filter, status }: IObservables) => ({
    items: database.collections
      .get('payments')
      .query(
        Q.sortBy('star', Q.desc),
        Q.sortBy('created_at', Q.desc),
        Q.where('name', Q.like(`%${Q.sanitizeLikeString(filter)}%`)),
        Q.where('status', Q.like(`%${Q.sanitizeLikeString(status)}%`)),
      ),
  }),
);

export const ObservedPayments = withDatabase(enhance(ObservedList));
