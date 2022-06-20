import { Model, Q } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import {
  field,
  date,
  readonly,
  writer,
  lazy,
  reader,
} from '@nozbe/watermelondb/decorators';

export default class PaymentModel extends Model {
  static table = 'payments';

  static associations: Associations = {
    payment_contacts: { type: 'has_many', foreignKey: 'payment_id' },
    payment_catalogs: { type: 'has_many', foreignKey: 'payment_id' },
  };

  @field('name') name!: string;
  @field('star') star!: boolean;
  @field('notes') notes!: string;
  @field('description') description!: string;
  @field('status') status!: IStatus;
  @field('extra') extra!: number;
  @field('discount') discount!: IDiscount | string;
  @field('fee') fee!: IFee | string;
  @field('methods') methods!: IMethod[] | string;
  @field('date') date!: number;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;

  @lazy orders = this.collections
    .get('payment_catalogs')
    .query(Q.on('payments', 'id', this.id));

  @lazy contacts = this.collections
    .get('payment_contacts')
    .query(Q.on('payments', 'id', this.id));

  @writer async delete() {
    await this.markAsDeleted(); // syncable
  }

  @reader async getPayment() {
    return {
      id: this.id,
      name: this.name,
      star: this.star,
      notes: this.notes,
      description: this.description,
      status: this.status,
      extra: this.extra,
      fee: this.fee,
      discount: this.discount,
      methods: this.methods,
      date: this.date,
    };
  }

  @writer async favorite() {
    await this.update(record => {
      record.star = !record.star;
    });
  }
}
