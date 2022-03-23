import { Scene, SceneEnter, SceneLeave, Ctx, Action } from 'nestjs-telegraf';
import { COMPLITE_ORDER_SCENE, MARKET_SCENE } from '../../app.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(COMPLITE_ORDER_SCENE)
export class CompliteScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.complite(ctx);
    return;
  }

  @Action('OK')
  async onOkAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(MARKET_SCENE);
    return;
  }

  @SceneLeave()
  onSceneLeave() {
    return;
  }
}
