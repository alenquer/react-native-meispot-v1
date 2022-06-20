import { Q, Database } from "@nozbe/watermelondb";
import PaymentContacts from "../../../../../database/models/payment_contacts";

interface IProps {
  id: any;
  database: Database;
}

export async function getContacts({ database, id }: IProps) {
  let _contacts: IContactProps[] = [];

  let relation = await database
    .get<PaymentContacts>("payment_contacts")
    .query(Q.where("payment_id", id))
    .fetch();

  for (let _relation of relation) {
    _contacts.push({
      status: "created",
      contact_id: _relation.contact.id,
      relation_id: _relation.id,
    });
  }

  return _contacts;
}
