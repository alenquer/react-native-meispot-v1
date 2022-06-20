import withObservables from '@nozbe/with-observables';
import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { ObservedList } from '..';

interface IObservables {
  filter: string;
  database: Database;
}

const enhance = withObservables(
  ['database', 'filter'],
  ({ database, filter }: IObservables) => ({
    items: database.collections
      .get('tasks')
      .query(
        Q.sortBy('star', Q.desc),
        Q.sortBy('created_at', Q.desc),
        Q.where('name', Q.like(`%${Q.sanitizeLikeString(filter)}%`)),
      ),
  }),
);

export const ObservedTasks = withDatabase(enhance(ObservedList));
