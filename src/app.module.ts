import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultAdminModule } from 'nestjs-admin';
import { UserModule } from './user/user.module';
import { BotModule } from './bot/bot.module';
import { ScanModule } from './scan/scan.module';

@Module({
  imports: [
    BotModule,
    TypeOrmModule.forRoot(),
    UserModule,
    DefaultAdminModule,
    ScanModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
