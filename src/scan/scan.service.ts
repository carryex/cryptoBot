import { HttpService, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MIN_AMOUNT } from 'src/bot/bot.constants';
import { apiUrl } from './scan.constants';

@Injectable()
export class ScanService {
  constructor(private readonly httpService: HttpService) {}

  async getWallet(wallet: string) {
    const url = `${apiUrl}account?address=${wallet}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    return data;
  }

  async getTransaction(hash: string) {
    const url = `${apiUrl}transaction-info?hash=${hash}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    return data;
  }

  async validateCryptoWallet(
    wallet: string,
    amount: number,
    notEnougthMoneyText: (value: string) => string,
    notFoundText: string,
  ) {
    if (amount < MIN_AMOUNT) {
      return {
        message: `Минимальная сумма для перевода: ${MIN_AMOUNT}\nВведите сумму для перевода`,
      };
    }
    const walletObj = await this.getWallet(wallet);
    if (walletObj) {
      const balances: any[] | undefined = walletObj.trc20token_balances;
      if (balances) {
        const { tokenDecimal, balance } = balances.find(
          (b) => b.tokenAbbr === 'USDT',
        );
        const formatedBalance = balance / Math.pow(10, tokenDecimal);
        if (formatedBalance >= amount) {
          return true;
        }
        return {
          message: notEnougthMoneyText(formatedBalance.toString()),
        };
      }
    }
    return { message: notFoundText };
  }
}
