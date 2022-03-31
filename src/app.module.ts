import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultAdminModule } from 'nestjs-admin';
import { UserModule } from './user/user.module';
import { BotModule } from './bot/bot.module';
import { ScanModule } from './scan/scan.module';
import { OrderModule } from './order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PullModule } from './pull/pull.module';
import { AppService } from './app.service';

@Module({
  imports: [
    BotModule,
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    DefaultAdminModule,
    ScanModule,
    OrderModule,
    PullModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
