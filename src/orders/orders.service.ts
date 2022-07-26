import { Order } from './models/orders.schema';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {
    this.createOrders();
  }

  async getAll() {
    return await this.httpService
      .get<Order[]>('https://recruitment-api.dev.flipfit.io/orders')
      .toPromise();
  }

  async createOrders() {
    const axiosResponse = await this.getAll();
    const orders = axiosResponse.data as Order[];

    for (const order of orders) {
      await this.orderModel.findByIdAndUpdate(order.id, order, {
        upsert: true,
      });
    }
  }
}
