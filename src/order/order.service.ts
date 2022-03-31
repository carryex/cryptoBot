import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { Order, OrderStatus, OrderType } from './order.entity';

@Injectable()
export class OrderService extends TypeOrmCrudService<Order> {
  constructor(@InjectRepository(Order) repo) {
    super(repo);
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.repo.create(createOrderDto);
    return await this.repo.save(order);
  }

  async cancel(id: number) {
    const result = await this.repo.update(id, { status: OrderStatus.CANCELED });
    if (result) {
      return true;
    }
    return false;
  }

  async getOrderByChatId(chatId: number): Promise<Order[]> {
    return await this.repo.find({ chatId });
  }

  getNewOrders() {
    return this.repo.find({
      status: OrderStatus.NEW,
      type: OrderType.PULL,
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.repo.update(id, updateOrderDto);
  }

  // @Cron('*/5 * * * * *')
  // async collectOrders() {
  //   // Взять новые зоявки со статусом НОВЫЕ
  //   const newOrders = await this.repo.find({
  //     status: OrderStatus.NEW,
  //     type: OrderType.PULL,
  //   });
  //   console.log(newOrders.length);
  //   // Доcтать или создать пул
  //   const pull = await this.console //Если пулл собрался то разослать уведомления
  //     .log('Collect');
  // }
}
