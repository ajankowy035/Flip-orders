import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

class OrderCustomer {
  id: string;
  name: string;
}

class OrderItem {
  product: OrderItemProduct;
}

class OrderItemProduct {
  id: string;
  name: string;
  price: number;
}

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop()
  date: string;

  @Prop()
  cutomer: OrderCustomer;

  @Prop()
  items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
