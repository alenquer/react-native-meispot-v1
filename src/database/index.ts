import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from '../database/schema';
import migrations from '../database/migrations';
import models from '../database/models';
import Database from '@nozbe/watermelondb/Database';

export default function CustomDB(id?: string) {
  const adapter = new SQLiteAdapter({
    jsi: false,
    dbName: id ?? 'default',
    schema,
    migrations,
  });

  return new Database({
    adapter,
    modelClasses: models,
  });
}
