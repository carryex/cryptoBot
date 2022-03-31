import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { CANCEL_ORDER_SCENE } from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(CANCEL_ORDER_SCENE)
@UseFilters(BotFilter)
export class CancelOrderScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.cancelOrder(ctx);
    return;
  }

  @Action(COMMANDS.OK)
  async onBackAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    return;
  }
}
