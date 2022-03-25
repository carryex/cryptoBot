import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import {
  ORDER_SCENE,
  ORDERS_SCENE,
  PULL_STATUS_SCENE,
  SUPPORT_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(ORDER_SCENE)
export class OrderScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.order(ctx);
    return;
  }

  @Action(COMMANDS.PULL_STATUS)
  async onPullStatusAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(PULL_STATUS_SCENE);
    return;
  }
  @Action(COMMANDS.MY_ORDERS)
  async onMyOrdersAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(ORDERS_SCENE);
    return;
  }
  @Action(COMMANDS.MAIN_MENU)
  async onMainMenuAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    return;
  }
  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(SUPPORT_SCENE);
    return;
  }
}
