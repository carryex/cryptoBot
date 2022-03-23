import { Scene, SceneEnter, SceneLeave, Ctx, Action } from 'nestjs-telegraf';
import { MARKET_SCENE, WALLET_SCENE } from '../../app.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(MARKET_SCENE)
export class MarketScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.market(ctx);
    return;
  }

  @Action('BACK')
  async onBackAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    await ctx.scene.leave();
    return;
  }

  @Action('ENTER_PULL')
  async onSellAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(WALLET_SCENE);
    return;
  }

  @Action('BYE')
  async onByeAction(@Ctx() ctx: Context) {
    console.log('bye');
    return;
  }

  @SceneLeave()
  onSceneLeave() {
    console.log('Leave from scene');
    return;
  }
}
