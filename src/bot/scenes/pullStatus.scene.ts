import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { PULL_STATUS_SCENE, HOW_SCENE, SUPPORT_SCENE } from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(PULL_STATUS_SCENE)
export class PullStatusScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.pullStatus(ctx);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(SUPPORT_SCENE);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    const prevScene = ctx.scene.session.state.prevScene;
    await ctx.scene.enter(prevScene || HOW_SCENE);
    return;
  }
}
