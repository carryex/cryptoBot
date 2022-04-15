import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Order, OrderStatus } from './order.entity';

@EventSubscriber()
@Injectable()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  constructor(connection: Connection, private eventEmitter: EventEmitter2) {
    connection.subscribers.push(this);
  }
  listenTo() {
    return Order;
  }

  afterUpdate(event: UpdateEvent<Order>): void | Promise<any> {
    const adminIDs = ['75742728'];
    if (event.entity?.status === OrderStatus.IN_CHECK) {
      const message = {
        chatId: adminIDs[0],
        text: `Новая заявка на проверку транзакции для заказа ${event.entity.id}`,
      };
      this.eventEmitter.emit('bot.sentMessage', message);
    }
    if (event.entity?.status === OrderStatus.CRYPTO_RECEIVED) {
      const message = {
        chatId: event.entity.chatId,
        text: `Деньги для завяки №${event.entity.id} получены`,
      };
      this.eventEmitter.emit('bot.sentMessage', message);
    }
  }

  beforeUpdate(event: UpdateEvent<Order>): void | Promise<any> {
    console.log(event.entity);
  }
}
