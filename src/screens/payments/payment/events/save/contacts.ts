import { Database } from "@nozbe/watermelondb";
import PaymentContacts from "../../../../../database/models/payment_contacts";

interface IProps {
  id: any;
  contacts: { data: IContactProps[] };
  database: Database;
}

export async function setContacts({ id, contacts, database }: IProps) {
  let actions: PaymentContacts[] = [];

  for (let item of contacts.data) {
    const get = database.get<PaymentContacts>("payment_contacts");

    if (item.relation_id) {
      const result = await get.find(item.relation_id);

      if (item.status === "deleted") {
        actions.push(result.prepareMarkAsDeleted());
      } else {
        actions.push(result.prepareUpdate((record) => {}));
      }
    } else {
      actions.push(
        get.prepareCreate((record) => {
          record.contact.id = item.contact_id;
          record.payment.id = id;
        })
      );
    }
  }

  return actions;
}
