import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { OrderService } from 'src/order/order.service';
import {
  ORDERS_SCENE,
  PULL_STATUS_SCENE,
  SUPPORT_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import { addPrevScene } from '../bot.utils';

@Scene(ORDERS_SCENE)
@UseFilters(BotFilter)
export class OrdersScene {
  constructor(
    private readonly botService: BotService,
    private readonly orderService: OrderService,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const chatId = ctx.from.id;
    if (chatId) {
      const orders = await this.orderService.getOrderByChatId(chatId);
      console.log('orders: ', orders);
      await this.botService.orders(ctx, orders);
      return;
    }
    throw new Error('Cannot get chat id');
  }

  @Action(COMMANDS.PULL_STATUS)
  async onPullStatusAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, ORDERS_SCENE);
    await ctx.scene.enter(PULL_STATUS_SCENE, state);
    return;
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, ORDERS_SCENE);
    await ctx.scene.enter(SUPPORT_SCENE, state);
    return;
  }

  @Action(COMMANDS.MAIN_MENU)
  async onMainMenuAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    return;
  }
}
