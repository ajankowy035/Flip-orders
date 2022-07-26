import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //most bought total
  @Get('/mostbought')
  mostBought() {
    return this.ordersService.mostBought();
  }

  //most bought yesterday
  @Get('/yesterday')
  mostBoughtYesterday() {
    return this.ordersService.mostBoughtYesterday();
  }

  //most profitable
  @Get('/profitable')
  profitable() {
    return this.ordersService.profitable();
  }
}
