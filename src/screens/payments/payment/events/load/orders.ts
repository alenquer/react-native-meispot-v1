import { Q, Database } from "@nozbe/watermelondb";
import PaymentCatalogs from "../../../../../database/models/payment_catalogs";

interface IProps {
  id: any;
  database: Database;
}

export async function getOrders({ database, id }: IProps) {
  let _orders: IStockProps[] = [];

  let relation = await database
    .get<PaymentCatalogs>("payment_catalogs")
    .query(Q.where("payment_id", id))
    .fetch();

  for (let _relation of relation) {
    _orders.push({
      status: "created",
      cost: _relation.cost,
      value: _relation.value,
      amount: _relation.amount,
      catalog_id: _relation.catalog.id,
      relation_id: _relation.id,
    });
  }

  return _orders;
}
