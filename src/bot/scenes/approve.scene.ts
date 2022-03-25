import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import {
  APPROVE_TRANSACTION_SCENE,
  APPROVE_SCENE,
  CANCEL_ORDER_SCENE,
  PULL_STATUS_SCENE,
  ORDER_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(APPROVE_SCENE)
export class ApproveScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.approve(ctx);
    return;
  }

  @Action(COMMANDS.CANCEL_ORDER)
  async onCancelOrderAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(CANCEL_ORDER_SCENE);
    return;
  }

  @Action(COMMANDS.APPROVE_TRANSACTION)
  async onAproveTransactionAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(ORDER_SCENE);
    return;
  }

  @Action(COMMANDS.PULL_STATUS)
  async onPullStatusAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(PULL_STATUS_SCENE);
    return;
  }

  @Action(COMMANDS.MAIN_MENU)
  async onMainMenuAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    return;
  }
}
