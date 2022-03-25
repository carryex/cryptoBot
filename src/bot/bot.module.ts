import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotName } from './bot.constants';
import { UserModule } from 'src/user/user.module';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';

import { botMiddleware } from './bot.middleware';
import { MarketScene } from './scenes/market.scene';
import { WalletScene } from './scenes/wallet.scene';
import { AmountScene } from './scenes/amount.scene';
import { ScanModule } from 'src/scan/scan.module';
import { ScanService } from 'src/scan/scan.service';
import { HowScene } from './scenes/how.scene';
import { PullStatusScene } from './scenes/pullStatus.scene';
import { SupportScene } from './scenes/support.scene';
import { OrdersScene } from './scenes/orders.scene';
import { EstateScene } from './scenes/estate.scene';
import { ApproveScene } from './scenes/approve.scene';
import { CancelOrderScene } from './scenes/cancelOrder.scene';
import { OrderScene } from './scenes/order.scene';
import { UrgentScene } from './scenes/urgent.scene';
import { EurToUsdtAmountScene } from './scenes/eurToUsdtAmount.scene';
import { EurToUsdtApproveScene } from './scenes/eurToUsdtApprove.scene';
import { EurToUsdtWalletScene } from './scenes/eurToUsdtWallet.scene';

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
    ApproveScene,
    HowScene,
    PullStatusScene,
    SupportScene,
    OrdersScene,
    EstateScene,
    CancelOrderScene,
    OrderScene,
    UrgentScene,
    EurToUsdtAmountScene,
    EurToUsdtApproveScene,
    EurToUsdtWalletScene,
  ],
})
export class BotModule {}
