import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import {
  date,
  field,
  reader,
  readonly,
  writer,
} from '@nozbe/watermelondb/decorators';

export default class TaskModel extends Model {
  static table = 'tasks';

  static associations: Associations = {};

  @writer async delete() {
    await this.markAsDeleted(); // syncable
  }

  @writer async favorite() {
    await this.update(record => {
      record.star = !record.star;
    });
  }

  @reader async getTask() {
    const { name, notes, star, date, time, status, type } = this;

    return {
      name,
      notes,
      star,
      status,
      date,
      time,
      type,
    };
  }

  @writer async setUpdate(newData: this) {
    return await this.update(record => {
      record.name = newData.name;
      record.notes = newData.notes;
      record.star = newData.star;
      record.status = newData.status;
      record.time = newData.time;
      record.type = newData.type;
      record.date = newData.date;
    });
  }

  @writer async setStatus(status: IStatus) {
    await this.update(record => {
      record.status = status;
    });
  }

  @field('name')
  name!: string;

  @field('notes')
  notes!: string;

  @field('star')
  star!: boolean;

  @field('status')
  status!: IStatus;

  @field('date')
  date!: number;

  @field('time')
  time!: number;

  @field('type')
  type!: string;

  @readonly
  @date('created_at')
  createdAt!: number;

  @readonly
  @date('updated_at')
  updatedAt!: number;
}
