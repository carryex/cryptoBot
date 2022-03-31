import { Injectable } from '@nestjs/common';
import { ScanService } from '../scan/scan.service';
import { Markup, Telegraf } from 'telegraf';
import { Context } from './bot.interface';
import { orderService, replyOrEdit } from './bot.utils';
import { BotName, BUTTONS, PULL_FILLED_SCENE, TEXT } from './bot.constants';
import { Order } from 'src/order/order.entity';
import { InjectBot } from 'nestjs-telegraf';
@Injectable()
export class BotService {
  constructor(
    @InjectBot(BotName)
    private readonly bot: Telegraf<Context>,
    private scanService: ScanService,
  ) {}

  async sendMessage(order: Order) {
    const buttons = [[BUTTONS.APPROVE_TRANSACTION, BUTTONS.ORDERS]];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    // this.bot.context.scene.enter(PULL_FILLED_SCENE, { orderId: order.id });
    const message = await this.bot.telegram.sendMessage(
      order.chatId,
      TEXT.PULL_FILLED(order.amount),
      // inlineButtons,
    );
    console.log(message);
    return message;
  }

  async start(ctx: Context) {
    const buttons = [
      [BUTTONS.USDT_TO_EUR, BUTTONS.EUR_TO_USDR],
      [BUTTONS.ESTATE],
    ];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    return replyOrEdit(ctx, TEXT.START, inlineButtons);
  }

  async market(ctx: Context) {
    const buttons = [
      [BUTTONS.JOIN_PULL, BUTTONS.HOW],
      [BUTTONS.URGENT, BUTTONS.MAIN_MENU],
    ];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    return replyOrEdit(ctx, TEXT.MARKET, inlineButtons);
  }

  async walletNumber(ctx: Context) {
    const buttons = [[BUTTONS.SUPPORT, BUTTONS.BACK]];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.WALLET_NUMBER, inlineKeyboard);
    return;
  }

  async amount(ctx: Context, balance?: number) {
    const buttons = [
      balance ? [BUTTONS.MAX(balance), BUTTONS.SUPPORT] : [BUTTONS.SUPPORT],
      [BUTTONS.BACK],
    ];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.AMOUNT, inlineKeyboard);
    return;
  }

  async invalidWallet(ctx: Context, text: string) {
    await orderService(ctx, text);
    return;
  }

  async invalidAmount(ctx: Context, balance?: number) {
    const buttons = [
      balance ? [BUTTONS.MAX(balance), BUTTONS.SUPPORT] : [BUTTONS.SUPPORT],
      [BUTTONS.BACK],
    ];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.INVALID_AMOUNT, inlineKeyboard);
    return;
  }

  async invalidAmountFormat(ctx: Context, balance?: number) {
    const buttons = [
      balance ? [BUTTONS.MAX(balance), BUTTONS.SUPPORT] : [BUTTONS.SUPPORT],
      [BUTTONS.BACK],
    ];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.INVALID_AMOUNT_FORMAT, inlineKeyboard);
    return;
  }

  async approve(ctx: Context) {
    const buttons = [
      [BUTTONS.CANCEL_ORDER, BUTTONS.APPROVE_TRANSACTION],
      [BUTTONS.PULL_STATUS, BUTTONS.MAIN_MENU],
    ];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.APPROVE, inlineKeyboard);
    return;
  }

  async how(ctx: Context) {
    const buttons = [[BUTTONS.PULL_STATUS, BUTTONS.ORDERS], [BUTTONS.BACK]];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.HOW, inlineKeyboard);
  }

  async pullStatus(ctx: Context, fill: number) {
    const buttons = [[BUTTONS.SUPPORT, BUTTONS.BACK]];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.PULL_STATUS(fill), inlineKeyboard);
  }

  async support(ctx: Context) {
    const buttons = [
      [BUTTONS.PULL_STATUS, BUTTONS.ORDERS],
      [BUTTONS.HOW, BUTTONS.BACK],
    ];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.SUPPORT, inlineKeyboard);
  }

  async orders(ctx: Context, orders: Order[]) {
    const buttons = [
      [BUTTONS.PULL_STATUS, BUTTONS.SUPPORT],
      [BUTTONS.MAIN_MENU],
    ];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.ORDERS(orders), inlineKeyboard);
  }

  async estate(ctx: Context) {
    const buttons = [BUTTONS.BACK];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.ESTATE, inlineKeyboard);
  }

  async cancelOrder(ctx: Context) {
    const buttons = [BUTTONS.OK];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.CANCEL_ORDER, inlineButtons);
    return;
  }

  async order(ctx: Context, { id, wallet, amount, status }: Order) {
    const buttons = [
      [BUTTONS.PULL_STATUS, BUTTONS.ORDERS],
      [BUTTONS.MAIN_MENU, BUTTONS.SUPPORT],
    ];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(
      ctx,
      TEXT.ORDER(id, wallet, amount, status),
      inlineButtons,
    );
    return;
  }

  async eurToUsdtApprove(ctx: Context, order: Order) {
    const buttons = [[BUTTONS.OK, BUTTONS.SUPPORT]];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.EUR_TO_USDT_APPROVE(order), inlineButtons);
    return;
  }

  async eurToUsdtInvalidAmount(ctx: Context) {
    const buttons = [BUTTONS.BACK, BUTTONS.SUPPORT];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.EUR_TO_USDT_AMOUNT, inlineButtons);
  }

  async urgent(ctx: Context) {
    const buttons = [BUTTONS.CONTINUE, BUTTONS.BACK];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.URGENT, inlineButtons);
    return;
  }

  async eurAmount(ctx: Context) {
    const buttons = [BUTTONS.BACK, BUTTONS.SUPPORT];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.EUR_TO_USDT_AMOUNT, inlineButtons);
  }

  async eurWallet(ctx: Context) {
    const buttons = [BUTTONS.BACK, BUTTONS.SUPPORT];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.EUR_TO_USDT_WALLET, inlineButtons);
  }

  async walletNotFound(ctx: Context) {
    const buttons = [BUTTONS.SUPPORT, BUTTONS.BACK];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.WALLET_NOT_FOUND, inlineButtons);
  }
}
