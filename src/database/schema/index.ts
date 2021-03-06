import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'contacts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'notes', type: 'string' },
        { name: 'avatar', type: 'string' },
        { name: 'star', type: 'boolean' },
        { name: 'document', type: 'string' },
        { name: 'phone', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'notes', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'time', type: 'number' },
        { name: 'date', type: 'number' },
        { name: 'star', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'catalogs',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'notes', type: 'string' },
        { name: 'value', type: 'number' },
        { name: 'fill', type: 'string' },
        { name: 'cost', type: 'number' },
        { name: 'code', type: 'string' },
        //{ name: "amount", type: "number" },
        { name: 'category', type: 'string' },
        { name: 'unit', type: 'string' },
        //{ name: "control", type: "boolean" },
        { name: 'star', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'payments',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'notes', type: 'string' },
        { name: 'extra', type: 'number' },
        { name: 'fee', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'discount', type: 'string' },
        { name: 'methods', type: 'string' },
        { name: 'star', type: 'boolean' },
        { name: 'date', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'payment_contacts',
      columns: [
        { name: 'contact_id', type: 'string' },
        { name: 'payment_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'payment_catalogs',
      columns: [
        { name: 'amount', type: 'number' },
        { name: 'value', type: 'number' },
        { name: 'cost', type: 'number' },
        { name: 'catalog_id', type: 'string' },
        { name: 'payment_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
