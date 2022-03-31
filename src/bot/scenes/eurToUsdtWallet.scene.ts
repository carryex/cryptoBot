import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action, On } from 'nestjs-telegraf';
import {
  EUR_TO_USDT_AMOUNT_SCENE,
  EUR_TO_USDT_APPROVE_SCENE,
  EUR_TO_USDT_WALLET_SCENE,
  SUPPORT_SCENE,
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

@Scene(EUR_TO_USDT_WALLET_SCENE)
@UseFilters(BotFilter)
export class EurToUsdtWalletScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.eurWallet(ctx);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, EUR_TO_USDT_WALLET_SCENE);
    await ctx.scene.enter(SUPPORT_SCENE, state);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    const { scene, state } = backCallback(ctx, EUR_TO_USDT_AMOUNT_SCENE);
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
      await deleteUserReplyMessage(ctx);
      const state = ctx.scene.session.state;
      state.wallet = wallet;
      state.prevScene = [];
      await ctx.scene.enter(EUR_TO_USDT_APPROVE_SCENE, state);
      return;
    }
  }
}
