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

    console.log(orders);
  }

  async profitable() {
    const data = await this.orderModel.aggregate([
      { $match: {} },
      { $unwind: '$items' },
      {
        $addFields: {
          convertedPrice: { $toDecimal: '$items.product.price' },
          convertedQuantity: { $toInt: '$items.quantity' },
        },
      },
      {
        $project: {
          _id: 1,
          total: { $multiply: ['$convertedPrice', '$convertedQuantity'] },
        },
      },
      { $sort: { total: -1 } },

      { $limit: 10 },
    ]);

    return data;
  }

  async mostBought() {
    const data = await this.orderModel.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalAmount: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },

      { $project: { _id: 1, totalAmount: 1 } },
      { $limit: 10 },
    ]);

    return data;
  }

  async mostBoughtYesterday() {
    const today = new Date().toDateString();
    const toodayIso = new Date(today).toISOString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const yesterdayIso = new Date(yesterday).toISOString();

    const data = await this.orderModel.aggregate([
      {
        $addFields: {
          convertedDate: { $toDate: '$date' },
        },
      },
      {
        $match: {
          date: {
            $gte: yesterdayIso,
            $lt: toodayIso,
          },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalAmount: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $project: { _id: 1, totalAmount: 1, convertedDate: 1 } },

      { $limit: 10 },
    ]);

    return data;
  }
}
