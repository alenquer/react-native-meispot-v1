import { Model, Q } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import {
  field,
  date,
  readonly,
  relation,
  writer,
  lazy,
} from '@nozbe/watermelondb/decorators';

export default class CatalogModel extends Model {
  static table = 'catalogs';

  static associations: Associations = {
    payment_catalogs: { type: 'has_many', foreignKey: 'catalog_id' },
  };

  @field('name') name!: string;
  @field('star') star!: boolean;
  @field('description') description!: string;
  @field('notes') notes!: string;
  @field('value') value!: number;
  @field('cost') cost!: number;
  @field('code') code!: string;
  @field('fill') fill!: string;
  //@field("amount") amount!: number;
  @field('unit') unit!: string;
  //@field("control") control!: boolean;
  @field('category') category!: ICatalogCategory;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;

  @lazy payments = this.collections
    .get('payment_catalogs')
    .query(Q.where('catalog_id', this.id));

  @writer async delete() {
    await this.markAsDeleted(); // syncable
  }

  @writer async setQuantity(val: number) {
    await this.update(record => {
      //record.amount = val;
    });
  }

  @writer async getCatalog() {
    return {
      id: this.id,
      name: this.name,
      star: this.star,
      notes: this.notes,
      category: this.category,
      cost: this.cost,
      fill: this.fill,
      description: this.description,
      //amount: this.amount,
      unit: this.unit,
      value: this.value,
      //control: this.control,
      code: this.code,
    };
  }

  @writer async setUpdate(updateData: this) {
    return await this.update(record => {
      record.name = updateData.name;
      record.category = updateData.category;
      record.star = updateData.star;
      record.cost = updateData.cost;
      record.fill = updateData.fill;
      //record.amount = updateData.amount;
      record.unit = updateData.unit;
      record.value = updateData.value;
      record.code = updateData.code;
      //record.control = updateData.control;
      record.description = updateData.description;
    });
  }

  @writer async favorite() {
    await this.update(record => {
      record.star = !record.star;
    });
  }
}
