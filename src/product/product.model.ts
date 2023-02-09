import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose/lib/prop';

class ProductCharacteristic {
  @prop()
  name: string;

  @prop()
  value: string;
}

// Base has _id, _v, _t fields
export interface ProductModel extends Base {}

// TimeStamps has createdAt, updatedAt fields
export class ProductModel extends TimeStamps {
  @prop()
  image: string;

  @prop()
  title: string;

  @prop()
  price: number;

  @prop()
  oldPrice?: number;

  @prop()
  credit: number;

  @prop()
  description: string;

  @prop()
  advantages: string;

  @prop()
  disadvantages: string;

  @prop({ type: () => [String] })
  categories: string[];

  @prop({ type: () => [String] })
  tags: string[];

  // id: false to not create index for nested keys
  @prop({ type: () => [ProductCharacteristic], _id: false })
  characteristics: ProductCharacteristic[];
}
