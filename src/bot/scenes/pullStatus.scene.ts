import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { PullService } from 'src/pull/pull.service';
import { PULL_STATUS_SCENE, SUPPORT_SCENE } from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import { addPrevScene, backCallback } from '../bot.utils';

@Scene(PULL_STATUS_SCENE)
@UseFilters(BotFilter)
export class PullStatusScene {
  constructor(
    private readonly botService: BotService,
    private readonly pullService: PullService,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const pull = await this.pullService.getActivePull();
    const fill = pull.amount / (pull.limit / 100);
    await this.botService.pullStatus(ctx, fill);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, PULL_STATUS_SCENE);
    await ctx.scene.enter(SUPPORT_SCENE, state);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    const { scene, state } = backCallback(ctx, SUPPORT_SCENE);
    await ctx.scene.enter(scene, state);
    return;
  }
}
