import {makeAutoObservable} from "mobx";
import {wallet} from "./Wallet";
// @ts-ignore
import console from 'console-browserify'
import {ethers} from "ethers";

class History {
  // Observable свойства
  transactions: ethers.providers.TransactionResponse[] = [];
  isLoading = false;

  // Метод для загрузки транзакций
  async fetchTransactions(address: string) {
    this.isLoading = true;

    try {
      const etherscanProvider = new ethers.providers.EtherscanProvider(Number(wallet.chain.chainId));
      this.transactions = await etherscanProvider.getHistory(address)
    } catch (error) {
      console.error("Ошибка при загрузке транзакций:", error);
    }
    finally {
      this.isLoading = false;
    }
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export const history = new History();
