import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import { Order } from './order.entity';
import { OrderSubscriber } from './order.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), DefaultAdminModule],
  controllers: [OrderController],
  providers: [OrderService, OrderSubscriber],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Order', Order);
  }
}
