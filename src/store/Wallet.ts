import {Contract, ethers} from "ethers";
import {makeAutoObservable} from "mobx";
import {makePersistable} from "mobx-persist-store";
import {secureStorage} from "../storage";

const abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]

class Wallet {
  get isAuthenticated() {
    return Boolean(this.address)
  };
  private _network = 'goerli';
  private _provider = ethers.getDefaultProvider(this._network)
  balance: string | null = null;
  address: string | null = null;
  privateKey: string | null = null;
  sendLoading = false;
  history:  ethers.providers.TransactionResponse[] = []
  historyLoading = true

  async send(to: string, amountInEther: string) {
    try {
      this.sendLoading = true;
      // Create a wallet instance
      let wallet = new ethers.Wallet(this.privateKey!, this._provider)

      // Create a transaction object
      let tx: ethers.utils.Deferrable<ethers.providers.TransactionRequest> = {
        to,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amountInEther),
      }
      // Send a transaction
      const txObj = await wallet.sendTransaction(tx);
      return txObj.hash
      // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
      // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
    }
    catch (e) {
      alert(e)
    }
    finally {
      this.sendLoading = false
    }
  }
  async signIn(seed: string) {
    try {
      let wallet = ethers.Wallet.fromMnemonic(seed);
      this.setUp(wallet);
      return true;
    }
    catch (e) {
      alert(e)
    }
  }
  async setUp(wallet: ethers.Wallet) {
    this.address = wallet.address;
    this.privateKey = wallet.privateKey;
    this.getBalance(wallet.address);
  }
  create() {
    const wallet = ethers.Wallet.createRandom(this._provider);
    return wallet.mnemonic?.phrase
  }
  async getBalance(address: string) {
    const balance = await this._provider.getBalance(address)
    this.balance = ethers.utils.formatEther(balance)
  }
  async getEstimatedTxFee() {
    const gasPrice = await this._provider.getGasPrice();
    const gasUnits =
      await new Contract(
        '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
        abi,
       this._provider
      ).estimateGas.functionName(params);
  }
  async getHistory(address: string) {
    this.historyLoading = true;
    const etherscanProvider = new ethers.providers.EtherscanProvider(this._network);
    this.history = await etherscanProvider.getHistory(address);
    this.history.reverse();
    this.historyLoading = false;
  }
  getLink(entity: 'address' | 'tx' | string, hash: string) {
    return `https://${this._network}.etherscan.io/${entity}/${hash}`
  }
  logout() {
    localStorage.clear();
    this.address = null;
    this.privateKey = null;
  }
  watchBalance() {
    this._provider.on('block', () => {
      this._provider.getBalance(this.address!).then((balance) => {
        const newBalance = ethers.utils.formatEther(balance)
        if (newBalance !== this.balance) {
          console.log(`balance: ${newBalance} ETH`);
          this.balance = newBalance;
        }
      })
    })
  }
  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'wallet',
      properties: ['address', 'privateKey'],
      storage: secureStorage
    }).then(() => {
      if(this.address) {
        this.getBalance(this.address);
        this.watchBalance();
      }
    })

  }
}

export const wallet = new Wallet()
