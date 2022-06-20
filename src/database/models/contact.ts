import { Model, Q } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import {
  field,
  writer,
  date,
  readonly,
  relation,
  lazy,
} from '@nozbe/watermelondb/decorators';

export default class ContactModel extends Model {
  static table = 'contacts';

  static associations: Associations = {
    payment_contacts: { type: 'has_many', foreignKey: 'contact_id' },
  };

  @field('name') name!: string;
  @field('star') star!: boolean;
  @field('email') email!: string;
  @field('notes') notes!: string;
  @field('avatar') avatar!: string;
  @field('phone') phone!: number;
  @field('document') document!: string;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;

  @lazy payments = this.collections
    .get('payment_contacts')
    .query(Q.where('contact_id', this.id));

  @writer async delete() {
    return await this.markAsDeleted();
  }

  @writer async setUpdate(newData: this) {
    return await this.update(record => {
      record.name = newData.name;
      record.phone = newData.phone;
      record.star = newData.star;
      record.email = newData.email;
      record.notes = newData.notes;
      record.avatar = newData.avatar;
      record.document = newData.document;
    });
  }

  @writer async getContact() {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      phone: this.phone,
      email: this.email,
      star: this.star,
      notes: this.notes,
      document: this.document,
    };
  }

  @writer async favorite() {
    await this.update(record => {
      record.star = !record.star;
    });
  }
}
