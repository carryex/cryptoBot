import { Scene, SceneEnter, SceneLeave, Ctx, Action } from 'nestjs-telegraf';
import {
  AMOUNT_SCENE,
  COMPLITE_ORDER_SCENE,
  CONFIRM_SCENE,
} from '../../app.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(CONFIRM_SCENE)
export class ConfirmScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.confirm(ctx);
    return;
  }

  @Action('BACK')
  async onBackAction(@Ctx() ctx: Context) {
    const { wallet } = ctx.scene.session.state;
    await ctx.scene.enter(AMOUNT_SCENE, { wallet });
    return;
  }

  @Action('CONFIRM')
  async onConfirmAction(@Ctx() ctx: Context) {
    console.log(ctx.scene.state);
    const { wallet, amount } = ctx.scene.session.state;
    if (wallet && amount) {
      //create order
    }
    await ctx.scene.enter(COMPLITE_ORDER_SCENE);
    return;
  }

  @SceneLeave()
  onSceneLeave() {
    return;
  }
}
