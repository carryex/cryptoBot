import { Injectable } from '@nestjs/common';
import { ScanService } from '../scan/scan.service';
import { Markup } from 'telegraf';
import { Context } from './bot.interface';
import { orderService, replyOrEdit } from './bot.utils';
import { BUTTONS, TEXT } from './bot.constants';
@Injectable()
export class BotService {
  constructor(private scanService: ScanService) {}
  echo(text: string): string {
    return `Echo: ${text}`;
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

  async validateWallet(wallet: string, min: number) {
    return await this.scanService.validateCryptoWallet(
      wallet,
      min,
      TEXT.NOT_ENOUGHT_MONEY,
      TEXT.WALLET_NOT_FOUND,
    );
  }

  async amount(ctx: Context) {
    const buttons = [[BUTTONS.MAX, BUTTONS.SUPPORT], [BUTTONS.BACK]];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.AMOUNT, inlineKeyboard);
    return;
  }

  async invalidWallet(ctx: Context, text: string) {
    await orderService(ctx, text);
    return;
  }

  async invalidAmount(ctx: Context, text: string) {
    await orderService(ctx, text);
    return;
  }

  async validateAmount(ctx: Context, amount: number) {
    const { wallet } = ctx.scene.session.state;
    return await this.scanService.validateCryptoWallet(
      wallet,
      amount,
      TEXT.NOT_ENOUGHT_MONEY,
      TEXT.WALLET_NOT_FOUND,
    );
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

  async pullStatus(ctx: Context) {
    const buttons = [[BUTTONS.SUPPORT, BUTTONS.BACK]];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.PULL_STATUS, inlineKeyboard);
  }

  async support(ctx: Context) {
    const buttons = [
      [BUTTONS.PULL_STATUS, BUTTONS.ORDERS],
      [BUTTONS.HOW, BUTTONS.BACK],
    ];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.SUPPORT, inlineKeyboard);
  }

  async orders(ctx: Context) {
    const buttons = [
      [BUTTONS.PULL_STATUS, BUTTONS.SUPPORT],
      [BUTTONS.MAIN_MENU],
    ];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.ORDERS, inlineKeyboard);
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

  async order(ctx: Context) {
    const buttons = [
      [BUTTONS.PULL_STATUS, BUTTONS.ORDERS],
      [BUTTONS.MAIN_MENU, BUTTONS.SUPPORT],
    ];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.ORDER, inlineButtons);
    return;
  }

  async eurToUsdtApprove(ctx: Context) {
    const buttons = [[BUTTONS.OK, BUTTONS.SUPPORT]];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, TEXT.EUR_TO_USDT_APPROVE, inlineButtons);
    return;
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
}
