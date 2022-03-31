import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action, On } from 'nestjs-telegraf';
import { ScanService } from 'src/scan/scan.service';
import {
  AMOUNT_SCENE,
  APPROVE_SCENE,
  MIN_AMOUNT,
  SUPPORT_SCENE,
  WALLET_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import {
  addPrevScene,
  commandHandler,
  deleteUserReplyMessage,
} from '../bot.utils';

@Scene(AMOUNT_SCENE)
@UseFilters(BotFilter)
export class AmountScene {
  constructor(
    private readonly botService: BotService,
    private readonly scanService: ScanService,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const wallet = ctx.scene.session.state.wallet;
    if (wallet) {
      const balance = await this.scanService.getWalletUSDTBalance(wallet);
      ctx.scene.session.state.walletBalance = balance;
      return await this.botService.amount(ctx, balance);
    }
    throw new Error('Cannot get user wallet');
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, AMOUNT_SCENE);
    await ctx.scene.enter(SUPPORT_SCENE, state);
    return;
  }

  @Action(COMMANDS.MAX_USDT)
  async onMaxAction(@Ctx() ctx: Context) {
    const { wallet, walletBalance } = ctx.scene.session.state;
    if (wallet && wallet) {
      await ctx.scene.enter(APPROVE_SCENE, { wallet, amount: walletBalance });
      return;
    }
    throw new Error('Cannot get user wallet');
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(WALLET_SCENE);
    return;
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    const { wallet, walletBalance } = ctx.scene.session.state;
    if ('text' in ctx.message) {
      const amount = ctx.message.text;
      if (commandHandler(ctx, amount, this.botService)) {
        return;
      }
      await deleteUserReplyMessage(ctx);
      if (!Number(amount)) {
        await this.botService.invalidAmountFormat(ctx, walletBalance);
        return;
      }
      if (Number(amount) < MIN_AMOUNT) {
        await this.botService.invalidAmount(ctx, walletBalance);
        return;
      }
      if (wallet && amount)
        return await ctx.scene.enter(APPROVE_SCENE, { wallet, amount });
      return;
    }
  }
}
