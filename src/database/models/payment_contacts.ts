import { Model } from "@nozbe/watermelondb";
import { immutableRelation, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export default class PaymentContacts extends Model {
  static table = "payment_contacts";

  static associations: Associations = {
    contacts: { type: "belongs_to", key: "contact_id" },
    payments: { type: "belongs_to", key: "payment_id" },
  };

  @immutableRelation("contacts", "contact_id") contact!: any;
  @immutableRelation("payments", "payment_id") payment!: any;
}
