import {
  Scene,
  SceneEnter,
  SceneLeave,
  Ctx,
  Action,
  On,
} from 'nestjs-telegraf';
import { AMOUNT_SCENE, CONFIRM_SCENE, WALLET_SCENE } from '../../app.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import { commandHandler, deleteUserReplyMessage } from '../bot.utils';

@Scene(AMOUNT_SCENE)
export class AmountScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.amount(ctx);
    return;
  }

  @Action('BACK')
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
      const isValid = await this.botService.validateAmount(ctx, Number(amount));
      if (isValid !== true) {
        await this.botService.invalidAmount(ctx, isValid.message);
        return;
      }
      const { wallet } = ctx.scene.session.state as any;
      await ctx.scene.enter(CONFIRM_SCENE, { wallet, amount });
      return;
    }
  }

  @SceneLeave()
  onSceneLeave() {
    return;
  }
}
