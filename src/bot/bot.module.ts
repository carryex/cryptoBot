import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotName } from '../app.constants';
import { UserModule } from 'src/user/user.module';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';

import { botMiddleware } from './bot.middleware';
import { MarketScene } from './scenes/market.scene';
import { WalletScene } from './scenes/wallet.scene';
import { AmountScene } from './scenes/amount.scene';
import { ConfirmScene } from './scenes/confirm.scene';
import { CompliteScene } from './scenes/complete.scene';
import { ScanModule } from 'src/scan/scan.module';
import { ScanService } from 'src/scan/scan.service';

@Module({
  imports: [
    ScanModule,
    UserModule,
    TelegrafModule.forRootAsync({
      botName: BotName,
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
        middlewares: [botMiddleware],
        include: [BotModule],
      }),
    }),
  ],
  providers: [
    BotUpdate,
    BotService,
    MarketScene,
    WalletScene,
    ScanService,
    AmountScene,
    ConfirmScene,
    CompliteScene,
  ],
})
export class BotModule {}
