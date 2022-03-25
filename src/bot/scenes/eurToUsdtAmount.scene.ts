import {
  Scene,
  SceneEnter,
  SceneLeave,
  Ctx,
  Action,
  On,
} from 'nestjs-telegraf';
import {
  APPROVE_SCENE,
  EUR_TO_USDT_AMOUNT_SCENE,
  EUR_TO_USDT_WALLET_SCENE,
  SUPPORT_SCENE,
  WALLET_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import { commandHandler, deleteUserReplyMessage } from '../bot.utils';

@Scene(EUR_TO_USDT_AMOUNT_SCENE)
export class EurToUsdtAmountScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.eurAmount(ctx);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(SUPPORT_SCENE);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(WALLET_SCENE);
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
        const message = `Сумма для перевода должна быть числом и не содежать букв.\nВведи сумму для перевода`;
        await this.botService.invalidAmount(ctx, message);
        return;
      }
      await ctx.scene.enter(EUR_TO_USDT_WALLET_SCENE);
      return;
    }
  }
}
