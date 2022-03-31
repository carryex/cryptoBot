import { UseFilters, UseInterceptors } from '@nestjs/common';
import {
  Scene,
  SceneEnter,
  SceneLeave,
  Ctx,
  Action,
  On,
} from 'nestjs-telegraf';
import { ScanService } from 'src/scan/scan.service';
import {
  AMOUNT_SCENE,
  MARKET_SCENE,
  SUPPORT_SCENE,
  WALLET_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { BotInterceptor } from '../bot.interceptor';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import {
  addPrevScene,
  backCallback,
  commandHandler,
  deleteUserReplyMessage,
} from '../bot.utils';

@Scene(WALLET_SCENE)
@UseFilters(BotFilter)
@UseInterceptors(BotInterceptor)
export class WalletScene {
  constructor(
    private readonly botService: BotService,
    private readonly scanService: ScanService,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.walletNumber(ctx);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, WALLET_SCENE);
    await ctx.scene.enter(SUPPORT_SCENE, state);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    const { scene, state } = backCallback(ctx, MARKET_SCENE);
    await ctx.scene.enter(scene, state);
    return;
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const wallet = ctx.message.text;
      if (commandHandler(ctx, wallet, this.botService)) {
        return;
      }
      const isWalletExist = await this.scanService.isWalletExist(wallet);
      await deleteUserReplyMessage(ctx);
      if (isWalletExist) {
        await ctx.scene.enter(AMOUNT_SCENE, { wallet });
        return;
      }
      await this.botService.walletNotFound(ctx);
      return;
    }
  }

  @SceneLeave()
  onSceneLeave() {
    return;
  }
}
