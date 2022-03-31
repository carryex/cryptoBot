import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { ORDERS_SCENE, ORDER_SCENE, PULL_FILLED_SCENE } from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(PULL_FILLED_SCENE)
@UseFilters(BotFilter)
export class PullFilledScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    // await this.botService.estate(ctx);
    return;
  }

  @Action(COMMANDS.MY_ORDERS)
  async onOrdersAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(ORDERS_SCENE);
    return;
  }

  @Action(COMMANDS.APPROVE_TRANSACTION)
  async onApproveTransactionAction(@Ctx() ctx: Context) {
    const orderId = ctx.scene.session.state.orderId;
    await ctx.scene.enter(ORDER_SCENE, { orderId });
    return;
  }
}
