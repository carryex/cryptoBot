import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import {
  SUPPORT_SCENE,
  PULL_STATUS_SCENE,
  HOW_SCENE,
  ORDERS_SCENE,
  MARKET_SCENE,
} from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { BotFilter } from '../bot.filter';
import { BotInterceptor } from '../bot.interceptor';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';
import { addPrevScene, backCallback } from '../bot.utils';

@Scene(SUPPORT_SCENE)
@UseFilters(BotFilter)
@UseInterceptors(BotInterceptor)
export class SupportScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.support(ctx);
    return;
  }

  @Action(COMMANDS.PULL_STATUS)
  async onPullStatusAction(@Ctx() ctx: Context) {
    const state = ctx.scene.session.state;
    state.prevScene.push(SUPPORT_SCENE);
    await ctx.scene.enter(PULL_STATUS_SCENE, state);
    return;
  }

  @Action(COMMANDS.MY_ORDERS)
  async onOrdersAction(@Ctx() ctx: Context) {
    await ctx.scene.enter(ORDERS_SCENE);
    return;
  }

  @Action(COMMANDS.HOW)
  async onHowAction(@Ctx() ctx: Context) {
    const state = addPrevScene(ctx, SUPPORT_SCENE);
    await ctx.scene.enter(HOW_SCENE, state);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    const { scene, state } = backCallback(ctx, MARKET_SCENE);
    await ctx.scene.enter(scene, state);
    return;
  }
}
