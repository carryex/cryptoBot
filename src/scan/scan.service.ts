import { HttpService, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { BOT_WALLET, MIN_AMOUNT } from 'src/bot/bot.constants';
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

  async getAccountTransactions(wallet: string) {
    const url = `${apiUrl}transaction?sort=-timestamp&count=true&limit=50&start=0&address=${BOT_WALLET}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    return data;
  }

  async isPaid(wallet: string) {
    const transactions = await this.getAccountTransactions(wallet);
    return true;
  }

  // async validateCryptoWallet(
  //   wallet: string,
  //   amount: number,
  //   notEnougthMoneyText: (value: string, min: number) => string,
  //   notFoundText: string,
  // ) {
  //   const walletObj = await this.getWallet(wallet);
  //   if (walletObj) {
  //     const balances: any[] | undefined = walletObj.trc20token_balances;
  //     if (balances) {
  //       const { tokenDecimal, balance } = balances.find(
  //         (b) => b.tokenAbbr === 'USDT',
  //       );
  //       const formatedBalance = balance / Math.pow(10, tokenDecimal);
  //       if (formatedBalance >= amount) {
  //         return true;
  //       }
  //       return {
  //         message: notEnougthMoneyText(formatedBalance.toString(), MIN_AMOUNT),
  //       };
  //     }
  //   }
  //   return { message: notFoundText };
  // }

  async isWalletExist(wallet: string) {
    const walletObj = await this.getWallet(wallet);
    if (walletObj.date_created) {
      return true;
    }
    return false;
  }

  async getWalletUSDTBalance(wallet: string): Promise<number | undefined> {
    const walletObj = await this.getWallet(wallet);
    if (walletObj) {
      const balances: any[] | undefined = walletObj.trc20token_balances;
      if (balances) {
        const { tokenDecimal, balance } = balances.find(
          (b) => b.tokenAbbr === 'USDT',
        );
        return balance / Math.pow(10, tokenDecimal);
      }
    }
    return undefined;
  }
}
