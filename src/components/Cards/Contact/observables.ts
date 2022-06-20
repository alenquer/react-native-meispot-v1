import withObservables from "@nozbe/with-observables";
import { Database, Q } from "@nozbe/watermelondb";
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import { ObservedList } from "..";

interface IObservables {
  data?: any;
  filter: string;
  database: Database;
}

const enhance = withObservables(
  ['database', 'data', 'filter'],
  ({ database, filter }: IObservables) => ({
    items: database.collections
      .get('contacts')
      .query(
        Q.sortBy('star', Q.desc),
        Q.sortBy('created_at', Q.desc),
        Q.where('name', Q.like(`%${Q.sanitizeLikeString(filter)}%`)),
      ),
  }),
);

export const ObservedContacts = withDatabase(enhance(ObservedList));
