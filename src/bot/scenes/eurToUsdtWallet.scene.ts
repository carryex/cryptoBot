import { Scene, SceneEnter, Ctx, Action, On } from 'nestjs-telegraf';
import {
  EUR_TO_USDT_AMOUNT_SCENE,
  EUR_TO_USDT_APPROVE_SCENE,
  EUR_TO_USDT_WALLET_SCENE,
  SUPPORT_SCENE,
  WALLET_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import { commandHandler, deleteUserReplyMessage } from '../bot.utils';

@Scene(EUR_TO_USDT_WALLET_SCENE)
export class EurToUsdtWalletScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.eurWallet(ctx);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(SUPPORT_SCENE);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(EUR_TO_USDT_AMOUNT_SCENE);
    return;
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const wallet = ctx.message.text;
      if (commandHandler(ctx, wallet, this.botService)) {
        return;
      }
      await deleteUserReplyMessage(ctx);
      await ctx.scene.enter(EUR_TO_USDT_APPROVE_SCENE);
      return;
    }
  }
}