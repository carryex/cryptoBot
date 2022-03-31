import { OrderType } from '../order.entity';

export class CreateOrderDto {
  readonly wallet: string;
  readonly amount: number;
  readonly chatId: number;
  readonly type?: OrderType;
}
