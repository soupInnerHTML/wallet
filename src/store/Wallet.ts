import {BigNumber, ethers} from "ethers";
import Web3 from 'web3'
import {makeAutoObservable} from "mobx";
import {makePersistable} from "mobx-persist-store";
import {secureStorage} from "../storage";
import {STAKING_CONTRACT_ADDRESS} from "../contracts/addresses";
import stakingAbi from 'contracts/abi/staking.json'
import {shortcutAddress} from "../utils/shortcut";
import {Chains, IChain} from "../global/chains";
import {notification} from "../utils/notification";

const console = {
  log(e: string) {
    console.log(e)
  }
}

const web3 = new Web3('https://goerli.infura.io/v3/d87b55ad8191420d834014708a0a0f17')

class Wallet {
  get isAuthenticated() {
    return Boolean(this.address)
  };
  chain = Chains.goerli;
  isChain(searchChain: IChain) {
    return this.chain.name === searchChain.name
  }
  get network() {
    return this.chain.rpc;
  }
  get provider() {
    return new ethers.providers.JsonRpcProvider(this.network)
  }
  private async getStakingContract() {
    const signer = new ethers.Wallet(this.privateKey!, this.provider)
    return new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingAbi, signer);
  }
  balance: string | null = null;

  get symbol() {
    return this.chain.currency
  }

  symbolical(amount: number | string) {
    return `${amount} ${this.symbol}`
  }

  get niceBalance() {
    return this.symbolical(Number(this.balance).toFixed(6))
  }
  address: string | null = null;
  get niceAddress() {
    return this.address ? shortcutAddress(this.address) : ''
  }
  privateKey: string | null = null;
  sendLoading = false;
  staked: string | null = null;

  async send(to: string, amountInEther: string) {
    try {
      this.sendLoading = true;
      // Create a wallet instance
      let wallet = new ethers.Wallet(this.privateKey!, this.provider)

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
    catch (e: any) {
      notification.error({message: e})
    }
    finally {
      this.sendLoading = false
    }
  }
  async signInBySeed(seed: string) {
    try {
      let wallet = ethers.Wallet.fromMnemonic(seed);
      this.setUp(wallet);
      return true;
    }
    catch (e: any) {
      notification.error({message: e})
    }
  }
  async signInByPrivateKey(privateKey: string) {
    try {
      let wallet = new ethers.Wallet(privateKey);
      this.setUp(wallet);
      return true;
    }
    catch (e: any) {
      notification.error({message: e})
    }
  }
  async setUp(wallet: ethers.Wallet) {
    this.address = wallet.address;
    this.privateKey = wallet.privateKey;
    this.getBalance(wallet.address);
  }
  create() {
    const wallet = ethers.Wallet.createRandom(this.provider);
    return wallet.mnemonic?.phrase
  }
  async getBalance(address: string) {
    const balance = await this.provider.getBalance(address)
    this.balance = ethers.utils.formatEther(balance)
  }
  async getEstimatedTxFee(to: string, value: string) {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = await web3.eth.estimateGas({
        from: this.address!,
        to: '0xB1D9330c1aA31FE3b56596c3f70b2e9F990D98C3',
        value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
      })

      return web3.utils.fromWei(BigNumber.from(gasLimit).mul(BigNumber.from(gasPrice)).toString())
    }
    catch (e) {
      return ''
    }

  }
  async stake(amount: string) {
    const stakingContract = await this.getStakingContract()
    const tx: ethers.providers.TransactionResponse = await stakingContract.stake({ value: ethers.utils.parseEther(amount) });
    this.getStakedTokens()
    return tx.hash
  }
  async unstake() {
    try {
      const stakingContract = await this.getStakingContract()
      const tx = await stakingContract.unstake();
      console.log(tx);
      await this.getStakedTokens()
    }
    catch (e: any) {
      notification.error({message: 'Staked period not complete.'})
    }
  }
  async getStakedTokens() {
    const stakingContract = await this.getStakingContract()
    const stakedAmount = await stakingContract.balances(this.address);
    this.staked = ethers.utils.formatEther(stakedAmount)
    console.log(this.staked)
  }
  async getStakedPeriod() {
    const stakingContract = await this.getStakingContract()
    const stakedPeriod = await stakingContract.stakingTimestamps(this.address);
    console.log(stakedPeriod)
  }
  getLink(entity: 'address' | 'tx' | string, hash: string) {
    return `${this.chain.blockScanUri}/${entity}/${hash}`
  }
  logout() {
    localStorage.clear();
    this.address = null;
    this.privateKey = null;
  }
  watchBalance() {
    this.provider.on('block', () => {
      this.provider.getBalance(this.address!).then((balance) => {
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
