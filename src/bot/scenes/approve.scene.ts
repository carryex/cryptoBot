import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { CreateOrderDto } from 'src/order/dto/createOrder.dto';
import { OrderStatus } from 'src/order/order.entity';
import { OrderService } from 'src/order/order.service';
import { PullService } from 'src/pull/pull.service';
import { ScanService } from 'src/scan/scan.service';
import {
  APPROVE_SCENE,
  CANCEL_ORDER_SCENE,
  PULL_STATUS_SCENE,
  ORDER_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import { addPrevScene } from '../bot.utils';

@Scene(APPROVE_SCENE)
@UseFilters(BotFilter)
export class ApproveScene {
  constructor(
    private readonly botService: BotService,
    private readonly orderService: OrderService,
    private readonly scanService: ScanService,
    private readonly pullService: PullService,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const { wallet, amount } = ctx.scene.session.state;
    if (wallet && Number(amount)) {
      const createOrderDto: CreateOrderDto = {
        wallet,
        amount: Number(amount),
        chatId: ctx.from.id,
      };
      const order = await this.orderService.create(createOrderDto);
      ctx.scene.session.state.orderId = order.id;
      await this.botService.approve(ctx);
      return;
    }
    throw new Error('Cannot save order');
  }

  @Action(COMMANDS.CANCEL_ORDER)
  async onCancelOrderAction(@Ctx() ctx: Context) {
    const orderId = ctx.scene.session.state.orderId;
    const order = await this.orderService.findOne(orderId, {
      relations: ['pull'],
    });
    const pull = order.pull;
    if (
      orderId &&
      order.status !== OrderStatus.CANCELED &&
      order.status !== OrderStatus.CRYPTO_RECEIVED &&
      (await this.orderService.cancel(orderId))
    ) {
      if (pull && pull.id) {
        await this.pullService.update(pull.id, {
          amount: pull.amount - order.amount,
        });
      }
      return await ctx.scene.enter(CANCEL_ORDER_SCENE);
    }
    throw new Error('Cannot cancele order');
  }

  @Action(COMMANDS.APPROVE_TRANSACTION)
  async onAproveTransactionAction(@Ctx() ctx: Context) {
    const orderId = ctx.scene.session.state.orderId;
    await ctx.scene.enter(ORDER_SCENE, { orderId });
    return;
  }

  @Action(COMMANDS.PULL_STATUS)
  async onPullStatusAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, APPROVE_SCENE);
    await ctx.scene.enter(PULL_STATUS_SCENE, state);
    return;
  }

  @Action(COMMANDS.MAIN_MENU)
  async onMainMenuAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    return;
  }
}
