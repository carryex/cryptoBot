import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { OrderService } from 'src/order/order.service';
import {
  ORDER_SCENE,
  ORDERS_SCENE,
  PULL_STATUS_SCENE,
  SUPPORT_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(ORDER_SCENE)
@UseFilters(BotFilter)
export class OrderScene {
  constructor(
    private readonly botService: BotService,
    private readonly orderService: OrderService,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const orderId = ctx.scene.session.state.orderId;
    const order = await this.orderService.findOne(orderId);
    await this.botService.order(ctx, order);
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
