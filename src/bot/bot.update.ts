import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Help,
  InjectBot,
  Ctx,
  Start,
  Update,
  Command,
  Action,
} from 'nestjs-telegraf';
import { AdminGuard } from '../admin/admin.guard';
import { Telegraf } from 'telegraf';
import { BotName, MARKET_SCENE } from '../app.constants';
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

  @Help()
  async onHelp(): Promise<string> {
    return 'Send me any text';
  }

  @Command(COMMANDS.MARKET)
  @Action('MARKET')
  async onAnswer(@Ctx() context: Context) {
    await context.scene.enter(MARKET_SCENE);
  }

  @Command(COMMANDS.ADMIN)
  @UseGuards(AdminGuard)
  async onAdminCommand(): Promise<string> {
    return 'Welcome judge';
  }

  @Command(COMMANDS.SETTINGS)
  async onSettingsCommand(): Promise<string> {
    return 'Welcome judge';
  }
}
