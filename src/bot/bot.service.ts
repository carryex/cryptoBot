import { Injectable } from '@nestjs/common';
import { ScanService } from '../scan/scan.service';
import { Markup } from 'telegraf';
import { Context } from './bot.interface';
import { getWalletTemplate, orderService, replyOrEdit } from './bot.utils';

@Injectable()
export class BotService {
  constructor(private scanService: ScanService) {}
  echo(text: string): string {
    return `Echo: ${text}`;
  }

  async start(ctx: Context) {
    const text = `Привет. Я криптобот\nЯ здесь, чтобы помочь обменять крипту, на наличные евро 💶.\n\nНа данный момент мы работаем только в Черногории 🇲🇪.`;
    const buttons = [Markup.button.callback('🏛️ Маркет', 'MARKET')];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    return replyOrEdit(ctx, text, inlineButtons);
  }

  async market(ctx: Context) {
    const text = `💠 Здесь вы можете купить криптовалюту за наличные евро или вывести ее через совместный пул.\n\nКак это работает 🤔:\n1) собираем пул заявок на вывод Tether USDT (BEP20)\n2) когда пул собран - даем ссылку на кошелек для перевода\n3) в течении 24 часов после проведения пула вы получите наличные евро 💶\n\n* Cрочный перевод от 10 000 USDT, комиссия 5%
    \n\n🛡 Бот выступает гарантом и удерживает монеты на время сделки. Комиссия на покупку – 0%, на продажу – 4%.`;
    const buttons = [
      [Markup.button.callback('🚀 Увавстовать в пуле', 'ENTER_PULL')],
      [
        Markup.button.callback('📈 Купить', 'BYE'),
        Markup.button.callback('📊 Сделки', 'DEALS'),
      ],
      [Markup.button.callback('🔥 Срочный вывод', 'FAST_PULL')],
      [Markup.button.callback('ℹ️ Статус пула', 'STATUS_PULL')],
      [Markup.button.callback('< Назад', 'BACK')],
    ];
    const inlineButtons = Markup.inlineKeyboard(buttons);
    return replyOrEdit(ctx, text, inlineButtons);
  }

  async walletNumber(ctx: Context) {
    const text = `Для заявки на пул и идентификации вас в системе введите номер вашего кошелька`;
    await orderService(ctx, text);
    return;
  }

  async validateWallet(wallet: string, min: number) {
    const notEnougthMoneyText = (balance: string) =>
      `На вашем кошельке не достаточно средств. (баланс вашего кошелька: ${balance})\nМинимальная сумма для вывода: ${min}.\nВведите номер кошелька с минимальной суммой для участия в пулле`;
    const notFoundText = `Кошелек не найден в сети блокчейн.\nВведите номер кошелька с минимальной суммой для участия в пулле или нажмите кнопку назад`;
    return await this.scanService.validateCryptoWallet(
      wallet,
      min,
      notEnougthMoneyText,
      notFoundText,
    );
  }

  async amount(ctx: Context) {
    const text = `Введите сумму для перевода`;
    await orderService(ctx, text);
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
    const notEnougthMoneyText = (balance: string) =>
      `На вашем кошельке не достаточно средств (баланс вашего кошелька: ${balance}).\nПополните кошелек на нужную сумму и попробуйте снова`;
    const notFoundText = `Кошелек не найден в сети блокчейн.\nВведите номер кошелька с минимальной суммой для участия в пулле или нажмите кнопку назад`;
    const { wallet } = ctx.scene.session.state;
    return await this.scanService.validateCryptoWallet(
      wallet,
      amount,
      notEnougthMoneyText,
      notFoundText,
    );
  }

  async confirm(ctx: Context) {
    const extraText = 'Подтвердите заявку';
    const { text, wallet, amount } = getWalletTemplate(ctx, extraText);
    if (wallet && amount) {
      const buttons = [
        [
          Markup.button.callback('✅ Подтвердить', 'CONFIRM'),
          Markup.button.callback('< Назад', 'BACK'),
        ],
      ];
      const inlineKeyboard = Markup.inlineKeyboard(buttons);
      await replyOrEdit(ctx, text, inlineKeyboard);
      return;
    }
  }

  async complite(ctx: Context) {
    const text = `🎉 Ваша заявка принята!\nПул начнется уже совсем скоро, и тогда мы пришлем вам данные для перевода средств.`;
    const buttons = [Markup.button.callback('ОК', 'OK')];
    const inlineKeyboard = Markup.inlineKeyboard(buttons);
    await replyOrEdit(ctx, text, inlineKeyboard);
    return;
  }
}
