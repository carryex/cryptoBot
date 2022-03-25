import {
  Scene,
  SceneEnter,
  SceneLeave,
  Ctx,
  Action,
  On,
} from 'nestjs-telegraf';
import {
  AMOUNT_SCENE,
  MARKET_SCENE,
  SUPPORT_SCENE,
  WALLET_SCENE,
} from '../bot.constants';
import { COMMANDS, MIN_AMOUNT } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import { commandHandler, deleteUserReplyMessage } from '../bot.utils';

@Scene(WALLET_SCENE)
export class WalletScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.walletNumber(ctx);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    const prevScene = WALLET_SCENE;
    await ctx.scene.enter(SUPPORT_SCENE, { prevScene });
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    const prevScene = ctx.scene.session.state.prevScene;
    await ctx.scene.enter(prevScene || MARKET_SCENE);
    return;
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const wallet = ctx.message.text;
      if (commandHandler(ctx, wallet, this.botService)) {
        return;
      }
      const isValid = await this.botService.validateWallet(wallet, MIN_AMOUNT);
      await deleteUserReplyMessage(ctx);
      if (isValid !== true) {
        await this.botService.invalidWallet(ctx, isValid.message);
        return;
      }
      await ctx.scene.enter(AMOUNT_SCENE, { wallet });
      return;
    }
  }

  @SceneLeave()
  onSceneLeave() {
    return;
  }
}
