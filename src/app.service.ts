import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BotService } from './bot/bot.service';
import { OrderStatus } from './order/order.entity';
import { OrderService } from './order/order.service';
import { PullStatus } from './pull/entities/pull.entity';
import { PullService } from './pull/pull.service';

@Injectable()
export class AppService {
  constructor(
    private readonly orderService: OrderService,
    private readonly pullService: PullService,
    private readonly botService: BotService,
  ) {}

  @Cron('*/5 * * * * *')
  async collect() {
    // Взять новые зоявки со статусом НОВЫЕ
    const newOrders = await this.orderService.getNewOrders();
    // console.log('Orders count: ', newOrders.length);
    // Calculate amount
    let amount = 0;
    newOrders.forEach((o) => {
      amount = o.amount + amount;
    });
    // console.log('Order total amount: ', amount);

    //Get pull
    const pull = await this.pullService.getOrCreatePull();
    // console.log('Current Pull: ', pull);
    pull.amount = pull.amount + amount;

    // Mutate orderes with pull
    const updatedOrders = newOrders.map((o) => {
      o.status = OrderStatus.COLLECTED;
      o.pull = pull;
      return o;
    });

    try {
      updatedOrders.forEach(async (o) => {
        await this.orderService.update(o.id, o);
      });

      if (pull.amount > pull.limit) {
        // Change status
        // console.log('Pull is full');
        pull.status = PullStatus.IS_REPLENISHED;
        // Отправить сообщение что нужно переводить деньги пользователям которые еще их не отправили
        const { orders } = await this.pullService.get(pull.id);
        // console.log(orders);
        if (orders) {
          orders.forEach(async (o) => {
            //send notifications
            if (o.status === OrderStatus.COLLECTED) {
              o.status = OrderStatus.WAITING_CRYPTO;
              this.orderService.update(o.id, o);
              const message = await this.botService.sendMessage(o);
              console.log(message);
              // console.log('Order chat id: ', o.chatId);
            }
          });
        }
      }
      await this.pullService.update(pull.id, pull);
    } catch (err: any) {
      console.log(err);
    }
  }
}
