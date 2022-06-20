import { Database } from "@nozbe/watermelondb";
import PaymentCatalogs from "../../../../../database/models/payment_catalogs";

interface IProps {
  id: any;
  orders: { data: IStockProps[] };
  database: Database;
}

export async function setOrders({ id, orders, database }: IProps) {
  let actions: PaymentCatalogs[] = [];

  for (let order of orders.data) {
    const get = database.get<PaymentCatalogs>("payment_catalogs");

    if (order.relation_id) {
      const result = await get.find(order.relation_id);

      if (order.status === "deleted") {
        actions.push(result.prepareMarkAsDeleted());
      } else {
        actions.push(
          result.prepareUpdate((record) => {
            record.amount = order.amount;
            record.value = order.value;
            record.cost = order.cost;
          })
        );
      }
    } else {
      actions.push(
        get.prepareCreate((record) => {
          record.amount = order.amount;
          record.value = order.value;
          record.cost = order.cost;
          record.catalog.id = order.catalog_id;
          record.payment.id = id;
        })
      );
    }
  }

  return actions;
}
