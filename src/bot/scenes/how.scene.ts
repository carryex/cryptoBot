import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import {
  HOW_SCENE,
  MARKET_SCENE,
  ORDERS_SCENE,
  PULL_STATUS_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(HOW_SCENE)
export class HowScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.how(ctx);
    return;
  }

  @Action(COMMANDS.PULL_STATUS)
  async onPullStatusAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(PULL_STATUS_SCENE);
    return;
  }

  @Action(COMMANDS.MY_ORDERS)
  async onOrdersAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(ORDERS_SCENE);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(MARKET_SCENE);
    return;
  }
}
