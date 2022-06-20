import { Model } from "@nozbe/watermelondb";
import {
  immutableRelation,
  relation,
  field,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import CatalogModel from "./catalog";
import PaymentModel from "./payment";

export default class PaymentCatalogs extends Model {
  static table = "payment_catalogs";

  static associations: Associations = {
    catalogs: { type: "belongs_to", key: "catalog_id" },
    payments: { type: "belongs_to", key: "payment_id" },
  };

  @field("amount") amount!: number;
  @field("value") value!: number;
  @field("cost") cost!: number;
  @immutableRelation("catalogs", "catalog_id") catalog!: CatalogModel;
  @immutableRelation("payments", "payment_id") payment!: PaymentModel;
}
