import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { Crud } from '@nestjsx/crud';
import { Order } from './order.entity';

@Crud({
  model: {
    type: Order,
  },
})
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}
