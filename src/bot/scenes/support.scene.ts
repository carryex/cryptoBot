import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import {
  SUPPORT_SCENE,
  PULL_STATUS_SCENE,
  HOW_SCENE,
  ORDERS_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(SUPPORT_SCENE)
export class SupportScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.support(ctx);
    return;
  }

  @Action(COMMANDS.PULL_STATUS)
  async onPullStatusAction(@Ctx() ctx: Context) {
    const prevScene = SUPPORT_SCENE;
    await ctx.scene.enter(PULL_STATUS_SCENE, { prevScene });
    return;
  }

  @Action(COMMANDS.MY_ORDERS)
  async onOrdersAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(ORDERS_SCENE);
    return;
  }

  @Action(COMMANDS.HOW)
  async onHowAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(HOW_SCENE);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    const prevScene = ctx.scene.session.state.prevScene;
    await ctx.scene.enter(prevScene || PULL_STATUS_SCENE);
    return;
  }
}
