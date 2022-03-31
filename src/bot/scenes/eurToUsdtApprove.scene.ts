import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { CreateOrderDto } from 'src/order/dto/createOrder.dto';
import { OrderType } from 'src/order/order.entity';
import { OrderService } from 'src/order/order.service';
import { EUR_TO_USDT_APPROVE_SCENE, SUPPORT_SCENE } from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import { addPrevScene } from '../bot.utils';

@Scene(EUR_TO_USDT_APPROVE_SCENE)
@UseFilters(BotFilter)
export class EurToUsdtApproveScene {
  constructor(
    private readonly botService: BotService,
    private readonly orderService: OrderService,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const { wallet, amount } = ctx.scene.session.state;

    if (wallet && Number(amount)) {
      const createOrderDto: CreateOrderDto = {
        wallet,
        amount: Number(amount),
        chatId: ctx.from.id,
        type: OrderType.URGENT,
      };
      const order = await this.orderService.create(createOrderDto);
      await this.botService.eurToUsdtApprove(ctx, order);
      return;
    }
    throw new Error('Cannot save user urgent order');
  }

  @Action(COMMANDS.SUPPORT)
  async onSupportAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, EUR_TO_USDT_APPROVE_SCENE);
    await ctx.scene.enter(SUPPORT_SCENE, state);
    return;
  }

  @Action(COMMANDS.OK)
  async onOkAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    return;
  }
}
