import {
  schemaMigrations,
  createTable,
  addColumns,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    // {
    //   toVersion: 2,
    //   steps: [
    //     createTable({
    //       name: "teste",
    //       columns: [],
    //     }),
    //   ],
    // },
  ],
});
