import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import {
  COMMANDS,
  HOW_SCENE,
  MARKET_SCENE,
  URGENT_SCENE,
  WALLET_SCENE,
} from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(MARKET_SCENE)
export class MarketScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.market(ctx);
    return;
  }

  @Action(COMMANDS.MAIN_MENU)
  async onMainMenuAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    await ctx.scene.leave();
    return;
  }

  @Action(COMMANDS.ENTER_PULL)
  async onEnterPullAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(WALLET_SCENE, { prevScene: MARKET_SCENE });
    return;
  }

  @Action(COMMANDS.HOW)
  async onHowAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(HOW_SCENE);
    return;
  }

  @Action(COMMANDS.URGENT)
  async onUrgentAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(URGENT_SCENE);
    return;
  }
}
