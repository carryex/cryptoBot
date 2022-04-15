import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BotService } from './bot.service';

@Injectable()
export class BotListener {
  constructor(private readonly botService: BotService) {}
  @OnEvent('bot.sentMessage')
  handleBotSentMessage(message: any) {
    this.botService.sendBaseMessage(message);
  }
}
