import { UseFilters, UseInterceptors } from '@nestjs/common';
import { InjectBot, Ctx, Start, Update, Action } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import {
  BotName,
  ESTATE_SCENE,
  EUR_TO_USDT_AMOUNT_SCENE,
  MARKET_SCENE,
} from './bot.constants';
import { BotFilter } from './bot.filter';
import { BotInterceptor } from './bot.interceptor';
import { Context } from './bot.interface';
import { BotService } from './bot.service';
import { UserService } from 'src/user/user.service';
import { createUserDtoFactory } from './bot.utils';
import { COMMANDS } from './bot.constants';

@Update()
@UseInterceptors(BotInterceptor)
@UseFilters(BotFilter)
export class BotUpdate {
  constructor(
    @InjectBot(BotName)
    private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
    private readonly userService: UserService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const createUserDto = createUserDtoFactory(ctx.from);
    await this.userService.createOrUpdate(createUserDto);
    ctx.session.messageId = undefined;
    await this.botService.start(ctx);
    return;
  }

  @Action(COMMANDS.USDT_TO_EUR)
  async onUsdtToEur(@Ctx() context: Context) {
    await context.scene.enter(MARKET_SCENE);
  }

  @Action(COMMANDS.EUR_TO_USDT)
  async onEurToUsdt(@Ctx() context: Context) {
    await context.scene.enter(EUR_TO_USDT_AMOUNT_SCENE);
  }

  @Action(COMMANDS.ESTATE)
  async onEstate(@Ctx() context: Context) {
    await context.scene.enter(ESTATE_SCENE);
  }
}
