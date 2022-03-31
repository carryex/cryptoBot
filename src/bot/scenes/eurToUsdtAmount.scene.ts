import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action, On } from 'nestjs-telegraf';
import {
  EUR_TO_USDT_AMOUNT_SCENE,
  EUR_TO_USDT_WALLET_SCENE,
  SUPPORT_SCENE,
  WALLET_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import {
  addPrevScene,
  backCallback,
  commandHandler,
  deleteUserReplyMessage,
} from '../bot.utils';

@Scene(EUR_TO_USDT_AMOUNT_SCENE)
@UseFilters(BotFilter)
export class EurToUsdtAmountScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.eurAmount(ctx);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, EUR_TO_USDT_AMOUNT_SCENE);
    await ctx.scene.enter(SUPPORT_SCENE, state);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    await ctx.scene.leave();
    return;
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const amount = ctx.message.text;
      if (commandHandler(ctx, amount, this.botService)) {
        return;
      }
      await deleteUserReplyMessage(ctx);
      if (!Number(amount)) {
        await this.botService.invalidAmount(ctx);
        return;
      }
      const state = addPrevScene(ctx, EUR_TO_USDT_WALLET_SCENE);
      state.amount = amount;
      await ctx.scene.enter(EUR_TO_USDT_WALLET_SCENE, state);
      return;
    }
  }
}
