import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { EUR_TO_USDT_APPROVE_SCENE, SUPPORT_SCENE } from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(EUR_TO_USDT_APPROVE_SCENE)
export class EurToUsdtApproveScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.eurToUsdtApprove(ctx);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(SUPPORT_SCENE);
    return;
  }

  @Action(COMMANDS.OK)
  async onOkAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    return;
  }
}
