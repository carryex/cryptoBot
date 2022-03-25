import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { ESTATE_SCENE } from '../bot.constants';
import { COMMANDS } from '../bot.constants';
import { Context } from '../bot.interface';
import { BotService } from '../bot.service';

@Scene(ESTATE_SCENE)
export class EstateScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.botService.estate(ctx);
    return;
  }

  @Action(COMMANDS.BACK)
  async onBackAction(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
    return;
  }
}
