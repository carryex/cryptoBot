import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { MARKET_SCENE, URGENT_SCENE, WALLET_SCENE } from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(URGENT_SCENE)
export class UrgentScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.urgent(ctx);
    return;
  }

  @Action(COMMANDS.CONTINUE)
  async onCantinueAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(WALLET_SCENE);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(MARKET_SCENE);
    return;
  }
}
